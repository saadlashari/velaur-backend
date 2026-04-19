import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#2C1810',
      color: '#FAE8D0',
      padding: '4rem 0 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#F2A7A7', marginBottom: '1rem' }}>🌹 Velaur</h3>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', lineHeight: 1.8, color: '#F9D5C0', fontWeight: 300 }}>
              Luxury car fragrances crafted to elevate every journey. Experience the art of scent on the road.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1.2rem', color: '#FAE8D0' }}>Quick Links</h4>
            {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/contact', 'Contact Us']].map(([to, label]) => (
              <Link key={to} to={to} style={{
                display: 'block', fontFamily: 'Jost, sans-serif', fontSize: '0.82rem',
                color: '#F9D5C0', marginBottom: '0.6rem', letterSpacing: '0.05em',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#F2A7A7'}
                onMouseLeave={e => e.target.style.color = '#F9D5C0'}
              >{label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1.2rem', color: '#FAE8D0' }}>Contact</h4>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', color: '#F9D5C0', marginBottom: '0.6rem' }}>📍 Lahore, Pakistan</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', color: '#F9D5C0', marginBottom: '0.6rem' }}>📞 +92-336-1118331</p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', color: '#F9D5C0', marginBottom: '0.6rem' }}>✉️ contact@velaur.pk</p>
          </div>

          {/* Payment */}
          <div>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1.2rem', color: '#FAE8D0' }}>We Accept</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['EasyPaisa', 'JazzCash'].map(m => (
                <span key={m} style={{
                  background: 'rgba(242,167,167,0.15)',
                  border: '1px solid rgba(242,167,167,0.3)',
                  color: '#F2A7A7', padding: '0.4rem 0.9rem',
                  fontFamily: 'Jost, sans-serif', fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(249,213,192,0.2)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: '#8B6F5E', letterSpacing: '0.1em' }}>
            © 2026 VELAUR. All rights reserved. Crafted with VELAUR🌹
          </p>
        </div>
      </div>
    </footer>
  );
  <style>{`
  @media (max-width: 768px) {
    footer > div > div:first-child { 
      grid-template-columns: 1fr 1fr !important; 
      gap: 2rem !important; 
    }
  }
  @media (max-width: 480px) {
    footer > div > div:first-child { 
      grid-template-columns: 1fr !important; 
    }
  }
`}</style>
}