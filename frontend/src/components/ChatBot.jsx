import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// ✅ Fix 1: Correct env variable name
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const sendMessage = (data) => axios.post(`${API}/chatbot/`, data);
const getConfig = () => axios.get(`${API}/chatbot/config/`);
const authAction = (data) => axios.post(`${API}/chatbot/auth/`, data);

// ✅ Fix 2: null check added
function MessageText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

function QuickReplies({ options, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onSelect(opt)} style={{
          background: 'transparent', border: '1px solid #F2A7A7',
          color: '#8B6F5E', padding: '0.3rem 0.8rem',
          fontFamily: 'Jost, sans-serif', fontSize: '0.72rem',
          cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2,
        }}
          onMouseEnter={e => { e.target.style.background = '#F2A7A7'; e.target.style.color = '#2C1810'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#8B6F5E'; }}
        >{opt}</button>
      ))}
    </div>
  );
}

function AuthForm({ mode, onSubmit, onSwitch }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  return (
    <div style={{ background: 'linear-gradient(135deg,#FDF0E8,#FAE8D0)', padding: '1rem', marginTop: '0.5rem' }}>
      <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', color: '#2C1810', marginBottom: '0.8rem' }}>
        {mode === 'login' ? '🔐 Login to Your Account' : '🌹 Create Account'}
      </p>
      {mode === 'register' && (
        <input placeholder="Username" value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={inputStyle} />
      )}
      <input placeholder="Email" type="email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={inputStyle} />
      <input placeholder="Password" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        style={inputStyle} />
      <button onClick={() => onSubmit(form)} style={btnStyle}>
        {mode === 'login' ? 'Login' : 'Register'}
      </button>
      <p onClick={onSwitch} style={{ fontFamily: 'Jost', fontSize: '0.72rem', color: '#F2A7A7', cursor: 'pointer', marginTop: '0.5rem', textAlign: 'center' }}>
        {mode === 'login' ? 'New user? Register here' : 'Already have account? Login'}
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%', border: '1px solid #FAE8D0', padding: '0.5rem 0.7rem',
  fontFamily: 'Jost', fontSize: '0.8rem', marginBottom: '0.5rem',
  color: '#2C1810', background: '#FFFDF9', outline: 'none', display: 'block',
};
const btnStyle = {
  width: '100%', background: '#2C1810', color: '#FAE8D0', border: 'none',
  padding: '0.6rem', fontFamily: 'Jost', fontSize: '0.75rem',
  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
};

export default function ChatBot({ products = [] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [checkoutStep, setCheckoutStep] = useState('idle');
  const [cart, setCart] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef(null);

  // ✅ Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getConfig().then(res => {
      setConfig(res.data);
      setMessages([{
        role: 'assistant',
        content: res.data.welcome_message || '🌹 Hello! I am Vera, your Velaur shopping assistant.',
        quickReplies: ['Show products', 'Best sellers', 'How to pay?', 'Track order']
      }]);
    }).catch(() => {
      setConfig({ bot_name: 'Vera' });
      setMessages([{
        role: 'assistant',
        content: '🌹 Hello! I am Vera, your Velaur shopping assistant. How can I help you today?',
        quickReplies: ['Show products', 'Best sellers', 'How to pay?']
      }]);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const addMessage = (role, content, extra = {}) => {
    setMessages(prev => [...prev, { role, content: content || '', ...extra }]);
  };

  const handleSend = async (text = null) => {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;
    setInput('');
    addMessage('user', msgText);
    setLoading(true);

    if (msgText.toLowerCase().includes('login') && !user) {
      setLoading(false);
      setAuthMode('login');
      addMessage('assistant', '🔐 Please login to your Velaur account:', { showAuthForm: true });
      return;
    }
    if (msgText.toLowerCase().includes('register') && !user) {
      setLoading(false);
      setAuthMode('register');
      addMessage('assistant', '🌹 Create your Velaur account:', { showAuthForm: true, authMode: 'register' });
      return;
    }

    try {
      const history = messages.slice(-12).map(m => ({ role: m.role, content: m.content || '' }));
      const res = await sendMessage({
        message: msgText,
        history,
        session_id: sessionId,
        products: products.slice(0, 20),
      });

      const { reply, action, data, cart: updatedCart } = res.data;
      if (updatedCart?.items) setCart(updatedCart.items);

      if (action === 'CHECKOUT_START') setCheckoutStep('confirm_cart');
      else if (action === 'SELECT_PAYMENT') setCheckoutStep('select_payment');
      else if (action === 'PAYMENT_INSTRUCTIONS') setCheckoutStep('payment_details');
      else if (action === 'ORDER_CONFIRMED') setCheckoutStep('idle');

      let quickReplies = [];
      if (action === 'CHECKOUT_START') quickReplies = ['yes', 'no'];
      if (action === 'SELECT_PAYMENT') quickReplies = ['easypaisa', 'jazzcash'];
      if (action === 'VIEW_CART') quickReplies = ['checkout', 'continue shopping'];
      if (action === 'CART_UPDATED') quickReplies = ['show cart', 'checkout', 'continue shopping'];
      if (action === 'ORDER_CONFIRMED') quickReplies = ['Show products', 'Track order'];

      addMessage('assistant', reply || '', {
        quickReplies: quickReplies.length ? quickReplies : undefined,
        isSuccess: action === 'ORDER_CONFIRMED',
        orderId: data?.order_id,
      });
    } catch {
      addMessage('assistant', "I'm having trouble connecting right now. Please try again shortly. 🌹");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (form) => {
    try {
      const res = await authAction({ action: authMode, ...form, session_id: sessionId });
      if (res.data.success) {
        setUser(res.data.user);
        setMessages(prev => prev.filter(m => !m.showAuthForm));
        addMessage('assistant', res.data.message || 'Welcome! 🌹', {
          quickReplies: ['Show products', 'View cart', 'My orders']
        });
        localStorage.setItem('velaur_token', res.data.access);
        localStorage.setItem('velaur_user', JSON.stringify(res.data.user));
      } else {
        addMessage('assistant', `❌ ${res.data.message}`);
      }
    } catch {
      addMessage('assistant', '❌ Authentication failed. Please try again.');
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ✅ Fix 3: Show button even when config is null — no more white screen
  const botName = config?.bot_name || 'Vera';

  // ✅ Mobile responsive window size
  const windowStyle = isMobile ? {
    position: 'fixed',
    bottom: '5rem',
    right: 0,
    left: 0,
    zIndex: 9998,
    width: '100vw',
    height: '75vh',
    background: '#FFFDF9',
    border: 'none',
    borderTop: '1px solid #FAE8D0',
    boxShadow: '0 -8px 30px rgba(44,24,16,0.12)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeUp 0.3s ease forwards',
  } : {
    position: 'fixed',
    bottom: '6.5rem',
    right: '2rem',
    zIndex: 9998,
    width: 380,
    height: 540,
    background: '#FFFDF9',
    border: '1px solid #FAE8D0',
    boxShadow: '0 20px 60px rgba(44,24,16,0.15)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeUp 0.3s ease forwards',
  };

  return (
    <>
      {/* Float Button */}
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed',
        bottom: isMobile ? '1.2rem' : '2rem',
        right: isMobile ? '1.2rem' : '2rem',
        zIndex: 9999,
        width: isMobile ? 52 : 56,
        height: isMobile ? 52 : 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#F2A7A7,#F9D5C0)',
        border: 'none',
        boxShadow: '0 8px 30px rgba(242,167,167,0.5)',
        fontSize: '1.5rem',
        cursor: 'pointer',
        transition: 'transform 0.25s',
        transform: open ? 'rotate(45deg) scale(1.05)' : 'scale(1)',
      }}>
        {open ? '✕' : '🌹'}
        {cartCount > 0 && !open && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#2C1810', color: '#FAE8D0',
            borderRadius: '50%', width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 600,
          }}>{cartCount}</span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={windowStyle}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#F2A7A7,#F9D5C0)',
            padding: '0.9rem 1.2rem',
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#FFFDF9', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
            }}>🌹</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', color: '#2C1810', fontWeight: 600 }}>
                {botName}
              </div>
              <div style={{ fontFamily: 'Jost,sans-serif', fontSize: '0.65rem', color: '#5C3D2E' }}>
                Velaur Assistant • {user ? `👤 ${user.username}` : 'Guest'}
              </div>
            </div>
            {cartCount > 0 && (
              <div style={{
                background: '#2C1810', color: '#FAE8D0',
                padding: '0.2rem 0.6rem',
                fontFamily: 'Jost', fontSize: '0.7rem',
              }}>🛒 {cartCount}</div>
            )}
            {/* Close button for mobile */}
            {isMobile && (
              <button onClick={() => setOpen(false)} style={{
                background: 'none', border: 'none', fontSize: '1.2rem',
                cursor: 'pointer', color: '#2C1810', padding: '0.3rem',
              }}>✕</button>
            )}
          </div>

          {/* Checkout indicator */}
          {checkoutStep !== 'idle' && (
            <div style={{
              background: '#FDF0E8', padding: '0.4rem 1rem',
              fontFamily: 'Jost', fontSize: '0.68rem',
              color: '#8B6F5E', letterSpacing: '0.1em', textTransform: 'uppercase',
              borderBottom: '1px solid #FAE8D0', flexShrink: 0,
            }}>
              🔄 Checkout in progress...
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.8rem',
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: isMobile ? '88%' : '85%',
                    padding: '0.7rem 1rem',
                    background: msg.role === 'user'
                      ? '#2C1810'
                      : msg.isSuccess
                        ? 'linear-gradient(135deg,#e8f5e9,#f1f8e9)'
                        : 'linear-gradient(135deg,#FDF0E8,#FAE8D0)',
                    color: msg.role === 'user' ? '#FAE8D0' : '#2C1810',
                    fontFamily: 'Jost,sans-serif',
                    fontSize: isMobile ? '0.85rem' : '0.82rem',
                    lineHeight: 1.65,
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    border: msg.isSuccess ? '1px solid #c8e6c9' : 'none',
                    whiteSpace: 'pre-line',
                  }}>
                    {msg.role === 'assistant' ? <MessageText text={msg.content} /> : msg.content}
                  </div>
                </div>

                {msg.showAuthForm && (
                  <AuthForm
                    mode={msg.authMode || authMode}
                    onSubmit={handleAuth}
                    onSwitch={() => setAuthMode(m => m === 'login' ? 'register' : 'login')}
                  />
                )}

                {msg.quickReplies && i === messages.length - 1 && (
                  <QuickReplies options={msg.quickReplies} onSelect={handleSend} />
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '0.35rem', padding: '0.3rem 0' }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#F2A7A7',
                    animation: `bounce 1s ease ${j * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '0.8rem',
            borderTop: '1px solid #FAE8D0',
            display: 'flex', gap: '0.5rem',
            background: '#FFFDF9', flexShrink: 0,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={checkoutStep === 'idle' ? 'Ask Vera anything...' : 'Type your response...'}
              style={{
                flex: 1, border: '1px solid #FAE8D0',
                padding: isMobile ? '0.75rem 0.9rem' : '0.6rem 0.9rem',
                fontFamily: 'Jost', fontSize: isMobile ? '0.9rem' : '0.82rem',
                outline: 'none', background: '#FFFDF9', color: '#2C1810',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                background: loading ? '#FAE8D0' : '#2C1810',
                color: loading ? '#8B6F5E' : '#FAE8D0',
                border: 'none',
                padding: isMobile ? '0.75rem 1.2rem' : '0.6rem 1rem',
                fontFamily: 'Jost', fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', minWidth: 44,
              }}>→</button>
          </div>

          {/* Footer */}
          <div style={{
            padding: '0.3rem', textAlign: 'center',
            fontFamily: 'Jost', fontSize: '0.62rem',
            color: '#C0A898', letterSpacing: '0.05em', flexShrink: 0,
          }}>
            {user ? `Logged in as ${user.email}` : 'Type "login" or "register" for full features'}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-6px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </>
  );
}