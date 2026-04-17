import json
import uuid
import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import ChatbotConfig, FAQ, StorePolicy, CustomReply, ChatSession


# ─── Gemini AI Helper ────────────────────────────────────────────────────────

def call_gemini(prompt, history=[]):
    """Call Gemini API with conversation history"""
    api_key = settings.GEMINI_API_KEY
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"    
    contents = []
    for msg in history[-10:]:
        contents.append({
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [{"text": msg["content"]}]
        })
    contents.append({"role": "user", "parts": [{"text": prompt}]})

    payload = {"contents": contents}
    try:
        res = requests.post(url, json=payload, timeout=15)
        data = res.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        # print("ERROR:", e)
        # return str(e)
        return "I'm having trouble right now. Please try again shortly. 🌹"


# ─── FAQ Matcher ─────────────────────────────────────────────────────────────

def find_faq_match(user_message):
    """Check if message matches any FAQ keywords"""
    msg_lower = user_message.lower()
    faqs = FAQ.objects.filter(is_active=True)
    for faq in faqs:
        keywords = [k.strip().lower() for k in faq.keywords.split(',') if k.strip()]
        if any(kw in msg_lower for kw in keywords):
            return faq.answer
        if faq.question.lower() in msg_lower:
            return faq.answer
    return None


def find_custom_reply(user_message):
    """Check if message matches any custom reply trigger"""
    msg_lower = user_message.lower()
    replies = CustomReply.objects.filter(is_active=True)
    for reply in replies:
        if reply.trigger_phrase.lower() in msg_lower:
            return reply.reply
    return None


def get_policies_text():
    """Get all active store policies as text"""
    policies = StorePolicy.objects.filter(is_active=True)
    if not policies:
        return ""
    text = "\n\nSTORE POLICIES:\n"
    for p in policies:
        text += f"- {p.title}: {p.content}\n"
    return text


# ─── Cart Helpers ─────────────────────────────────────────────────────────────

def format_cart_summary(cart):
    if not cart:
        return "Your cart is empty."
    lines = ["🛒 *Your Cart:*\n"]
    total = 0
    for item in cart:
        subtotal = float(item['price']) * item['quantity']
        total += subtotal
        lines.append(f"• {item['name']} x{item['quantity']} = Rs. {subtotal:,.0f}")
    lines.append(f"\n💰 *Total: Rs. {total:,.0f}*")
    return "\n".join(lines)


# ─── Main Chatbot View ────────────────────────────────────────────────────────

class ChatbotView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        history = request.data.get('history', [])
        session_id = request.data.get('session_id', str(uuid.uuid4()))
        products = request.data.get('products', [])

        if not user_message:
            return Response({'error': 'Message required'}, status=400)

        # Language check — only English/Hindi/Urdu allowed
        # (Gemini handles this via system prompt)

        # Get or create session
        session, _ = ChatSession.objects.get_or_create(session_id=session_id)

        # Get config
        try:
            config = ChatbotConfig.objects.get(pk=1)
        except ChatbotConfig.DoesNotExist:
            config = ChatbotConfig.objects.create()

        # ── Priority 1: Custom Reply Override ──────────────────────────────
        custom = find_custom_reply(user_message)
        if custom:
            return Response({
                'reply': custom,
                'action': None,
                'session_id': session_id,
                'source': 'custom'
            })

        # ── Priority 2: FAQ Match ──────────────────────────────────────────
        faq_answer = find_faq_match(user_message)

        # ── Handle Checkout Flow ──────────────────────────────────────────
        checkout_response = self._handle_checkout_flow(
            user_message, session, config, products, history
        )
        if checkout_response:
            return Response({**checkout_response, 'session_id': session_id})

        # ── Priority 3: Gemini AI ──────────────────────────────────────────
        policies_text = get_policies_text()
        products_text = json.dumps(products[:15]) if products else "[]"

        system_context = f"""You are {config.bot_name}, the AI shopping assistant for Velaur — a luxury car perfume brand from Pakistan.

LANGUAGE RULES:
- ONLY respond in English or Urdu or Roman (mix allowed)  
- If user writes in any other language, politely ask them to use English or Urdu or Roman
- Example: "Sorry, I can only assist in English or Urdu or Roman. Please try again!"

YOUR ROLE:
- Help customers discover, purchase, and track Velaur products
- Guide through full shopping: browse → cart → checkout → payment
- Be warm, elegant, and helpful like a luxury brand assistant

AVAILABLE PRODUCTS:
{products_text}

PAYMENT METHODS (ONLY these two):
- EasyPaisa: {config.easypaisa_number} (Account: {config.easypaisa_account_name})
- JazzCash: {config.jazzcash_number} (Account: {config.jazzcash_account_name})
- NO bank cards or credit cards

CHECKOUT COMMANDS you understand:
- "add [product] to cart" → respond with: {{"action":"ADD_TO_CART","product_name":"name","product_id":id}}
- "show cart" / "view cart" → respond with: {{"action":"VIEW_CART"}}
- "checkout" / "place order" → respond with: {{"action":"START_CHECKOUT"}}
- "remove [product]" → respond with: {{"action":"REMOVE_FROM_CART","product_name":"name"}}

{policies_text}

{f'FAQ ANSWER FOR THIS QUERY: {faq_answer}' if faq_answer else ''}

IMPORTANT: For checkout/payment actions return ONLY valid JSON. For normal conversation return plain text.
Keep responses concise, friendly, and in character as a luxury brand assistant.
"""

        reply = call_gemini(system_context + "\n\nUser: " + user_message, history)

        # Try to parse as action
        try:
            clean = reply.strip().strip('```json').strip('```').strip()
            action_data = json.loads(clean)
            return Response({
                'reply': action_data.get('message', self._action_to_message(action_data, config)),
                'action': action_data.get('action'),
                'data': action_data,
                'session_id': session_id,
                'source': 'gemini'
            })
        except (json.JSONDecodeError, ValueError):
            return Response({
                'reply': reply,
                'action': None,
                'session_id': session_id,
                'source': 'gemini' if not faq_answer else 'faq'
            })

    def _action_to_message(self, data, config):
        action = data.get('action', '')
        if action == 'ADD_TO_CART':
            return f"✅ Added **{data.get('product_name', 'product')}** to your cart! Type 'view cart' to review."
        if action == 'VIEW_CART':
            return "Opening your cart... 🛒"
        if action == 'START_CHECKOUT':
            return "Let's proceed to checkout! 🌹"
        return "Done!"

    def _handle_checkout_flow(self, message, session, config, products, history):
        """Handle multi-step checkout inside chat"""
        msg = message.lower().strip()
        step = session.checkout_step

        # ── Step: Idle — detect checkout triggers ─────────────────────────
        if step == 'idle':
            if any(w in msg for w in ['checkout', 'place order', 'buy now', 'purchase', 'order karna']):
                if not session.cart_data:
                    return {
                        'reply': "🛒 Your cart is empty! Please add some products first.\n\nType the name of any product to add it to your cart.",
                        'action': 'EMPTY_CART'
                    }
                # Show cart and ask to confirm
                summary = format_cart_summary(session.cart_data.get('items', []))
                session.checkout_step = 'confirm_cart'
                session.save()
                return {
                    'reply': f"{summary}\n\n✅ Shall I proceed to payment? Type **'yes'** to continue or **'no'** to keep shopping.",
                    'action': 'CHECKOUT_START'
                }

            # Add to cart
            if any(w in msg for w in ['add', 'cart mein', 'add karo', 'add to cart']):
                matched = self._find_product(message, products)
                if matched:
                    items = session.cart_data.get('items', [])
                    existing = next((i for i in items if i['id'] == matched['id']), None)
                    if existing:
                        existing['quantity'] += 1
                    else:
                        items.append({
                            'id': matched['id'],
                            'name': matched['name'],
                            'price': str(matched['price']),
                            'quantity': 1
                        })
                    session.cart_data = {'items': items}
                    session.save()
                    total = sum(float(i['price']) * i['quantity'] for i in items)
                    return {
                        'reply': f"✅ **{matched['name']}** added to cart!\n💰 Cart Total: Rs. {total:,.0f}\n\nType 'checkout' when ready to order or 'show cart' to review.",
                        'action': 'CART_UPDATED',
                        'cart': session.cart_data
                    }

            # Show cart
            if any(w in msg for w in ['show cart', 'view cart', 'my cart', 'cart dekho', 'cart dikhao']):
                items = session.cart_data.get('items', [])
                return {
                    'reply': format_cart_summary(items) + "\n\nType 'checkout' to place your order!",
                    'action': 'VIEW_CART',
                    'cart': session.cart_data
                }

            # Remove from cart
            if any(w in msg for w in ['remove', 'delete', 'hata do', 'nikalo']):
                matched = self._find_product(message, products)
                if matched:
                    items = [i for i in session.cart_data.get('items', []) if i['id'] != matched['id']]
                    session.cart_data = {'items': items}
                    session.save()
                    return {
                        'reply': f"🗑️ **{matched['name']}** removed from cart.\n\n{format_cart_summary(items)}",
                        'action': 'CART_UPDATED',
                        'cart': session.cart_data
                    }

            return None  # Let Gemini handle

        # ── Step: Confirm Cart ─────────────────────────────────────────────
        if step == 'confirm_cart':
            if any(w in msg for w in ['yes', 'haan', 'proceed', 'ha', 'ok', 'okay', 'confirm']):
                session.checkout_step = 'select_payment'
                session.save()
                return {
                    'reply': "💳 Please select your payment method:\n\n1️⃣ Type **'easypaisa'** for EasyPaisa\n2️⃣ Type **'jazzcash'** for JazzCash",
                    'action': 'SELECT_PAYMENT'
                }
            else:
                session.checkout_step = 'idle'
                session.save()
                return {
                    'reply': "No problem! Keep browsing. 🌹 Type 'checkout' whenever you're ready.",
                    'action': None
                }

        # ── Step: Select Payment ───────────────────────────────────────────
        if step == 'select_payment':
            if 'easypaisa' in msg:
                session.pending_order_data = {**session.pending_order_data, 'method': 'easypaisa'}
                session.checkout_step = 'show_payment_instructions'
                session.save()
                cart_items = session.cart_data.get('items', [])
                total = sum(float(i['price']) * i['quantity'] for i in cart_items)
                return {
                    'reply': f"""💚 **EasyPaisa Payment Instructions:**

📱 Open EasyPaisa app → Send Money
📞 Account Number: **{config.easypaisa_number}**
👤 Account Name: **{config.easypaisa_account_name}**
💰 Amount to Send: **Rs. {total:,.0f}**

After sending payment, please share:
1️⃣ Your **Transaction ID**
2️⃣ Your **Sender Name**
3️⃣ Your **Mobile Number** used for payment

Type your Transaction ID to continue ✅""",
                    'action': 'PAYMENT_INSTRUCTIONS',
                    'payment_method': 'easypaisa',
                    'amount': total
                }
            elif 'jazzcash' in msg:
                session.pending_order_data = {**session.pending_order_data, 'method': 'jazzcash'}
                session.checkout_step = 'show_payment_instructions'
                session.save()
                cart_items = session.cart_data.get('items', [])
                total = sum(float(i['price']) * i['quantity'] for i in cart_items)
                return {
                    'reply': f"""🔴 **JazzCash Payment Instructions:**

📱 Open JazzCash app → Send Money
📞 Account Number: **{config.jazzcash_number}**
👤 Account Name: **{config.jazzcash_account_name}**
💰 Amount to Send: **Rs. {total:,.0f}**

After sending payment, please share:
1️⃣ Your **Transaction ID**
2️⃣ Your **Sender Name**
3️⃣ Your **Mobile Number** used for payment

Type your Transaction ID to continue ✅""",
                    'action': 'PAYMENT_INSTRUCTIONS',
                    'payment_method': 'jazzcash',
                    'amount': total
                }
            else:
                return {
                    'reply': "Please type **'easypaisa'** or **'jazzcash'** to select payment method.",
                    'action': None
                }

        # ── Step: Get Transaction ID ───────────────────────────────────────
        if step == 'show_payment_instructions':
            session.pending_order_data = {**session.pending_order_data, 'transaction_id': message}
            session.checkout_step = 'get_sender_name'
            session.save()
            return {
                'reply': f"✅ Transaction ID saved: **{message}**\n\nNow please enter your **Sender Name** (name on your EasyPaisa/JazzCash account):",
                'action': None
            }

        # ── Step: Get Sender Name ──────────────────────────────────────────
        if step == 'get_sender_name':
            session.pending_order_data = {**session.pending_order_data, 'sender_name': message}
            session.checkout_step = 'get_sender_number'
            session.save()
            return {
                'reply': f"✅ Name saved: **{message}**\n\nNow enter your **mobile number** used for payment:",
                'action': None
            }

        # ── Step: Get Sender Number ────────────────────────────────────────
        if step == 'get_sender_number':
            session.pending_order_data = {**session.pending_order_data, 'sender_number': message}
            session.checkout_step = 'get_shipping_name'
            session.save()
            return {
                'reply': f"✅ Number saved!\n\n📦 Now I need your **shipping details**.\n\nPlease enter your **Full Name** for delivery:",
                'action': None
            }

        # ── Step: Get Shipping Name ────────────────────────────────────────
        if step == 'get_shipping_name':
            session.pending_order_data = {**session.pending_order_data, 'full_name': message}
            session.checkout_step = 'get_shipping_phone'
            session.save()
            return {
                'reply': f"✅ Name: **{message}**\n\nEnter your **phone number** for delivery:",
                'action': None
            }

        # ── Step: Get Phone ────────────────────────────────────────────────
        if step == 'get_shipping_phone':
            session.pending_order_data = {**session.pending_order_data, 'phone': message}
            session.checkout_step = 'get_shipping_address'
            session.save()
            return {
                'reply': "Enter your complete **delivery address**:",
                'action': None
            }

        # ── Step: Get Address ──────────────────────────────────────────────
        if step == 'get_shipping_address':
            session.pending_order_data = {**session.pending_order_data, 'address': message}
            session.checkout_step = 'get_shipping_city'
            session.save()
            return {
                'reply': "Enter your **city**:",
                'action': None
            }

        # ── Step: Get City & Create Order ─────────────────────────────────
        if step == 'get_shipping_city':
            order_data = session.pending_order_data
            order_data['city'] = message
            cart_items = session.cart_data.get('items', [])
            total = sum(float(i['price']) * i['quantity'] for i in cart_items)

            try:
                order = self._create_order_and_payment(order_data, cart_items, total, session)
                session.checkout_step = 'idle'
                session.cart_data = {}
                session.pending_order_data = {}
                session.save()

                return {
                    'reply': f"""🌹 **Order Placed Successfully!**

━━━━━━━━━━━━━━━━━━━━
📦 Order ID: **#{order['id']}**
💰 Total: **Rs. {total:,.0f}**
💳 Payment: **{order_data.get('method', '').title()}**
🔄 Status: **Pending Verification**
━━━━━━━━━━━━━━━━━━━━

Your payment is being verified by our team. You will be notified once confirmed (usually within 1-2 hours).

Thank you for choosing Velaur! 🌹✨""",
                    'action': 'ORDER_CONFIRMED',
                    'order_id': order['id']
                }
            except Exception as e:
                session.checkout_step = 'idle'
                session.save()
                return {
                    'reply': f"❌ Order could not be placed. Error: {str(e)}\n\nPlease try again or contact us.",
                    'action': 'ORDER_FAILED'
                }

        return None

    def _find_product(self, message, products):
        """Find product by name mention in message"""
        msg_lower = message.lower()
        for product in products:
            name_lower = product.get('name', '').lower()
            if name_lower in msg_lower or any(
                word in msg_lower for word in name_lower.split() if len(word) > 3
            ):
                return product
        return None

    def _create_order_and_payment(self, order_data, cart_items, total, session):
        """Create order and payment directly via Django models"""
        from orders.models import Order, OrderItem
        from payments.models import Payment

        order = Order.objects.create(
            full_name=order_data.get('full_name', ''),
            email=order_data.get('email', 'chatbot@velaur.pk'),
            phone=order_data.get('phone', ''),
            address=order_data.get('address', ''),
            city=order_data.get('city', ''),
            total_price=total,
            status='pending',
            user=session.user
        )

        for item in cart_items:
            from products.models import Product
            try:
                product = Product.objects.get(id=item['id'])
            except Product.DoesNotExist:
                product = None
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=item['name'],
                price=item['price'],
                quantity=item['quantity']
            )

        Payment.objects.create(
            order=order,
            method=order_data.get('method', 'easypaisa'),
            transaction_number=order_data.get('transaction_id', ''),
            sender_number=order_data.get('sender_number', ''),
            screenshot='',
            status='pending'
        )

        return {'id': order.id}


# ─── Config API for Frontend ──────────────────────────────────────────────────

class ChatbotConfigView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            config = ChatbotConfig.objects.get(pk=1)
        except ChatbotConfig.DoesNotExist:
            config = ChatbotConfig.objects.create()

        return Response({
            'bot_name': config.bot_name,
            'welcome_message': config.welcome_message,
            'is_active': config.is_active,
            'easypaisa_number': config.easypaisa_number,
            'jazzcash_number': config.jazzcash_number,
        })


# ─── Auth via Chatbot ─────────────────────────────────────────────────────────

class ChatbotAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        action = request.data.get('action')  # 'login' or 'register'
        session_id = request.data.get('session_id', '')

        if action == 'login':
            from users.views import LoginView
            from django.test import RequestFactory
            email = request.data.get('email')
            password = request.data.get('password')
            from django.contrib.auth import authenticate
            from rest_framework_simplejwt.tokens import RefreshToken
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = authenticate(request, username=email, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                # Save token to session
                if session_id:
                    try:
                        session = ChatSession.objects.get(session_id=session_id)
                        session.user = user
                        session.jwt_token = str(refresh.access_token)
                        session.save()
                    except ChatSession.DoesNotExist:
                        pass
                return Response({
                    'success': True,
                    'message': f'Welcome back, {user.username}! 🌹 You are now logged in.',
                    'access': str(refresh.access_token),
                    'user': {'email': user.email, 'username': user.username}
                })
            return Response({'success': False, 'message': 'Invalid email or password. Please try again.'}, status=400)

        if action == 'register':
            from users.serializers import RegisterSerializer
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(user)
                if session_id:
                    try:
                        session = ChatSession.objects.get(session_id=session_id)
                        session.user = user
                        session.jwt_token = str(refresh.access_token)
                        session.save()
                    except ChatSession.DoesNotExist:
                        pass
                return Response({
                    'success': True,
                    'message': f'Account created! Welcome to Velaur, {user.username}! 🌹',
                    'access': str(refresh.access_token),
                    'user': {'email': user.email, 'username': user.username}
                })
            return Response({'success': False, 'message': str(serializer.errors)}, status=400)

        return Response({'error': 'Invalid action'}, status=400)