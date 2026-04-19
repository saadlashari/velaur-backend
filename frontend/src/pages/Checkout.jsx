import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, getCartTotal, clearCart } from '../services/cartService';
import { createOrder } from '../services/api';
import PaymentUpload from '../components/PaymentUpload';

export default function Checkout() {
  const navigate = useNavigate();
  const cart = getCart();
  const total = getCartTotal();
  const [step, setStep] = useState(1); // 1=info, 2=payment, 3=success
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', address: '', city: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    const { full_name, email, phone, address, city } = form;
    if (!full_name || !email || !phone || !address || !city) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        ...form,
        total_price: total,
        items: cart.map(item => ({
          product: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };
      const res = await createOrder(orderData);
      setOrderId(res.data.id);
      setStep(2);
    } catch {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step === 1) {
    navigate('/cart');
    return null;
  }

  return (
    <main style={{ paddingTop: 90, minHeight: '100vh', background: '#FFFDF9' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Steps */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '3rem', justifyContent: 'center' }}>
          {[['1', 'Shipping'], ['2', 'Payment'], ['3', 'Confirmed']].map(([num, label], i) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: step >= parseInt(num) ? '#2C1810' : '#FAE8D0',
                  color: step >= parseInt(num) ? '#FAE8D0' : '#8B6F5E',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Jost', fontSize: '0.82rem', transition: 'all 0.3s',
                }}>{num}</div>
                <span style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: step >= parseInt(num) ? '#2C1810' : '#8B6F5E' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 60, height: 1, background: '#FAE8D0', margin: '0 0.5rem', marginBottom: 20 }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Shipping Info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2C1810', marginBottom: '2rem', fontWeight: 400 }}>Shipping Information</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
              {[
                { name: 'full_name', label: 'Full Name', placeholder: 'Your full name', span: 2 },
                { name: 'email', label: 'Email', placeholder: 'your@email.com' },
                { name: 'phone', label: 'Phone', placeholder: '03XX-XXXXXXX' },
                { name: 'address', label: 'Address', placeholder: 'Street address', span: 2 },
                { name: 'city', label: 'City', placeholder: 'e.g. Lahore' },
              ].map(field => (
                <div key={field.name} style={{ gridColumn: field.span ? `span ${field.span}` : 'auto' }}>
                  <label style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>
                    {field.label}
                  </label>
                  <input name={field.name} value={form[field.name]} onChange={handleChange}
                    placeholder={field.placeholder}
                    style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
                </div>
              ))}
            </div>

            {/* Order Summary mini */}
            <div style={{ background: '#FDF0E8', padding: '1.5rem', marginBottom: '2rem' }}>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2C1810', marginBottom: '1rem', fontWeight: 400 }}>Order Summary</h4>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#5C3D2E' }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#2C1810' }}>Rs. {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #FAE8D0', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2C1810' }}>Total</span>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2C1810' }}>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={loading} style={{
              width: '100%', background: '#2C1810', color: '#FAE8D0', border: 'none',
              padding: '1rem', fontFamily: 'Jost', fontSize: '0.82rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Placing Order...' : 'Continue to Payment'}
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <PaymentUpload
            orderId={orderId}
            totalAmount={total}
            onSuccess={() => { clearCart(); setStep(3); }}
          />
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🌹</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#2C1810', marginBottom: '1rem', fontWeight: 400 }}>
              Order Received!
            </h2>
            <p style={{ fontFamily: 'Jost', fontSize: '0.9rem', color: '#5C3D2E', lineHeight: 1.9, maxWidth: 400, margin: '0 auto 2rem', fontWeight: 300 }}>
              Thank you for your order. We've received your payment proof and will verify it within 1–2 hours. You'll receive a confirmation soon.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/')} style={{
                background: '#2C1810', color: '#FAE8D0', border: 'none',
                padding: '0.9rem 2rem', fontFamily: 'Jost', fontSize: '0.8rem',
                letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
              }}>Back to Home</button>
              <button onClick={() => navigate('/products')} style={{
                background: 'transparent', color: '#2C1810', border: '1px solid #2C1810',
                padding: '0.9rem 2rem', fontFamily: 'Jost', fontSize: '0.8rem',
                letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
              }}>Shop More</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
  @media (max-width: 768px) {
    .checkout-grid { grid-template-columns: 1fr !important; }
    main > div > div:last-child > div > div { 
      grid-template-columns: 1fr !important; 
    }
  }
  @media (max-width: 480px) {
    .checkout-steps > div { gap: 0.3rem !important; }
  }
`}</style>
    </main>
  );
}