import { useState } from 'react';
import { sendContact } from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) { alert('Please fill required fields'); return; }
    setLoading(true);
    try {
      await sendContact(form);
      setSent(true);
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: 90, minHeight: '100vh', background: '#FFFDF9' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #F2A7A7, #F9D5C0, #FAE8D0)', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B6F5E', marginBottom: '0.8rem' }}>Get In Touch</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#2C1810', fontWeight: 400 }}>Contact Us</h1>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '6rem', alignItems: 'start' }}>

          {/* Info */}
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2C1810', marginBottom: '1rem', fontWeight: 400 }}>We'd love to hear from you</h2>
            <p style={{ fontFamily: 'Jost', fontSize: '0.88rem', color: '#5C3D2E', lineHeight: 1.9, marginBottom: '2.5rem', fontWeight: 300 }}>
              Whether you have questions about our fragrances, need help with an order, or just want to say hello — we're here for you.
            </p>

            {[
              { icon: '📍', label: 'Location', value: 'Lahore, Pakistan' },
              { icon: '📞', label: 'Phone', value: '+92-336-1118331' },
              { icon: '✉️', label: 'Email', value: 'contact@velaur.pk' },
              { icon: '⏰', label: 'Hours', value: 'Mon–Sat: 10am – 8pm' },
            ].map(info => (
              <div key={info.label} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #F2A7A7, #F9D5C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {info.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B6F5E', marginBottom: '0.2rem' }}>{info.label}</div>
                  <div style={{ fontFamily: 'Jost', fontSize: '0.88rem', color: '#2C1810' }}>{info.value}</div>
                </div>
              </div>
            ))}

            {/* Payment methods */}
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#FDF0E8', borderLeft: '3px solid #F2A7A7' }}>
              <p style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B6F5E', marginBottom: '0.8rem' }}>Payment Methods</p>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {['💚 EasyPaisa', '🔴 JazzCash'].map(m => (
                  <span key={m} style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#2C1810', background: '#FFFDF9', padding: '0.4rem 0.8rem', border: '1px solid #FAE8D0' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(135deg, #FDF0E8, #FAE8D0)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌹</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#2C1810', marginBottom: '0.8rem', fontWeight: 400 }}>Message Sent!</h3>
                <p style={{ fontFamily: 'Jost', fontSize: '0.85rem', color: '#5C3D2E', lineHeight: 1.8 }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#2C1810', marginBottom: '0.5rem', fontWeight: 400 }}>Send a Message</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  {[
                    { name: 'name', label: 'Your Name *', placeholder: 'Full name' },
                    { name: 'email', label: 'Email *', placeholder: 'your@email.com' },
                    { name: 'phone', label: 'Phone', placeholder: '03XX-XXXXXXX' },
                    { name: 'subject', label: 'Subject', placeholder: 'What is this about?' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={{ fontFamily: 'Jost', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>{f.label}</label>
                      <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder}
                        style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none' }} />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ fontFamily: 'Jost', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E', display: 'block', marginBottom: '0.4rem' }}>Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help..." rows={5}
                    style={{ width: '100%', border: '1px solid #FAE8D0', padding: '0.8rem', fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810', background: '#FFFDF9', outline: 'none', resize: 'vertical' }} />
                </div>

                <button onClick={handleSubmit} disabled={loading} style={{
                  background: '#2C1810', color: '#FAE8D0', border: 'none',
                  padding: '1rem', fontFamily: 'Jost', fontSize: '0.8rem',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
  @media (max-width: 768px) {
    main > div:last-child > div { 
      grid-template-columns: 1fr !important; 
      gap: 2rem !important; 
    }
    main > div:last-child > div > div > div { 
      grid-template-columns: 1fr !important; 
    }
  }
`}</style>
    </main>
  );
}