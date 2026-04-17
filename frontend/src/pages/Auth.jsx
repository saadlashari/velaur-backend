import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginUser(form.email, form.password);
      } else {
        if (!form.username || !form.email || !form.password) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }
        await registerUser(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.email?.[0] || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <main style={{ paddingTop: 90, minHeight: '100vh', background: 'linear-gradient(135deg, #F2A7A7 0%, #F9D5C0 50%, #FAE8D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '0 1.5rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', color: '#2C1810', marginBottom: '0.3rem', fontWeight: 400 }}>🌹 Velaur</h1>
          <p style={{ fontFamily: 'Jost', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B6F5E' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </p>
        </div>

        <div style={{ background: 'rgba(255,253,249,0.95)', backdropFilter: 'blur(12px)', padding: '2.5rem', boxShadow: '0 20px 60px rgba(44,24,16,0.12)' }}>

          {/* Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '2rem', border: '1px solid #FAE8D0' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                padding: '0.7rem', background: mode === m ? '#2C1810' : 'transparent',
                color: mode === m ? '#FAE8D0' : '#8B6F5E', border: 'none',
                fontFamily: 'Jost', fontSize: '0.75rem', letterSpacing: '0.15em',
                textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
              }}>{m === 'login' ? 'Sign In' : 'Register'}</button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <div>
                <label style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>Username *</label>
                <input name="username" value={form.username} onChange={handleChange} onKeyDown={handleKey}
                  placeholder="Choose a username"
                  style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
              </div>
            )}

            <div>
              <label style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} onKeyDown={handleKey}
                placeholder="your@email.com"
                style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} onKeyDown={handleKey}
                  placeholder="03XX-XXXXXXX"
                  style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
              </div>
            )}

            <div>
              <label style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} onKeyDown={handleKey}
                placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter password'}
                style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
            </div>

            {error && (
              <div style={{ background: '#FFF0F0', border: '1px solid #F2A7A7', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.8rem', color: '#C0392B' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{
              background: '#2C1810', color: '#FAE8D0', border: 'none',
              padding: '1rem', fontFamily: 'Jost', fontSize: '0.8rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              marginTop: '0.5rem', transition: 'all 0.2s',
            }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <p style={{ fontFamily: 'Jost', fontSize: '0.78rem', color: '#8B6F5E', textAlign: 'center', marginTop: '1.5rem' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              style={{ color: '#F2A7A7', cursor: 'pointer', textDecoration: 'underline' }}>
              {mode === 'login' ? 'Register' : 'Sign In'}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}