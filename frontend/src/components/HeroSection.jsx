import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F2A7A7 0%, #F9D5C0 45%, #FAE8D0 100%)',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,253,249,0.25)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(44,24,16,0.06)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>

        {/* Left Content */}
        <div style={{ animation: 'fadeUp 0.9s ease forwards' }}>
          <p style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#8B6F5E',
            marginBottom: '1.5rem',
          }}>Luxury Car Fragrances</p>

          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#2C1810',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            Scent the<br />
            <em style={{ fontStyle: 'italic', color: '#8B6F5E' }}>Journey</em>
          </h1>

          <p style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '1rem',
            color: '#5C3D2E',
            maxWidth: 400,
            lineHeight: 1.8,
            marginBottom: '2.5rem',
            fontWeight: 300,
          }}>
            Elevate every drive with Velaur's exquisite collection of luxury car perfumes. Where elegance meets the open road.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              background: '#2C1810',
              color: '#FFFDF9',
              padding: '1rem 2.5rem',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.78rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              transition: 'all 0.3s',
              display: 'inline-block',
            }}
              onMouseEnter={e => { e.target.style.background = '#F2A7A7'; e.target.style.color = '#2C1810'; }}
              onMouseLeave={e => { e.target.style.background = '#2C1810'; e.target.style.color = '#FFFDF9'; }}
            >Shop Now</Link>

            <Link to="/contact" style={{
              background: 'transparent',
              color: '#2C1810',
              padding: '1rem 2.5rem',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.78rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid #2C1810',
              transition: 'all 0.3s',
              display: 'inline-block',
            }}>Discover More</Link>
          </div>
        </div>

        {/* Right - Decorative */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div style={{
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'rgba(255,253,249,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,253,249,0.6)',
            boxShadow: '0 30px 80px rgba(44,24,16,0.12)',
            fontSize: '9rem',
            animation: 'fadeIn 1.2s ease forwards',
          }}>
            🌹
          </div>

          {/* Floating labels */}
          {[
            { top: '10%', left: '-5%', text: 'Long Lasting' },
            { bottom: '15%', right: '-5%', text: 'Premium Scents' },
            { top: '55%', left: '-10%', text: 'Handcrafted' },
          ].map((label, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: label.top, bottom: label.bottom,
              left: label.left, right: label.right,
              background: 'rgba(255,253,249,0.9)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 1rem',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#2C1810',
              boxShadow: '0 4px 20px rgba(242,167,167,0.2)',
              animation: `fadeIn ${0.8 + i * 0.2}s ease forwards`,
            }}>{label.text}</div>
          ))}
        </div>
      </div>

      <style>{`
  @media (max-width: 768px) {
    section > div > div { 
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
      text-align: center !important;
    }
    section > div > div > div:last-child { display: none !important; }
    section { min-height: auto !important; padding: 6rem 0 3rem !important; }
    section > div > div > div:first-child > div { justify-content: center !important; flex-wrap: wrap !important; }
  }
  @media (max-width: 480px) {
    section { padding: 5rem 0 2.5rem !important; }
  }
`}</style>
    </section>
  );
}