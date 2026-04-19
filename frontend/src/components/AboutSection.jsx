export default function AboutSection() {
  return (
    <section id="about" style={{ padding: '7rem 0', background: '#FFFDF9' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

          {/* Left: Decorative visual */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              aspectRatio: '4/5',
              background: 'linear-gradient(135deg, #F2A7A7, #F9D5C0, #FAE8D0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem',
              position: 'relative',
            }}>
              🌹
              <div style={{
                position: 'absolute',
                bottom: '-1.5rem',
                right: '-1.5rem',
                background: '#2C1810',
                color: '#FAE8D0',
                padding: '1.5rem 2rem',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                fontStyle: 'italic',
                maxWidth: 200,
              }}>
                "Where every drive becomes a luxury experience"
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F2A7A7', marginBottom: '1rem' }}>
              Our Story
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#2C1810', marginBottom: '1.5rem', lineHeight: 1.2, fontWeight: 400 }}>
              Born from a Passion<br />for Luxury & Scent
            </h2>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', color: '#5C3D2E', lineHeight: 1.9, marginBottom: '1.2rem', fontWeight: 300 }}>
              Velaur was created for those who believe that luxury extends beyond the destination — it lives in every moment of the journey. We craft premium car fragrances that transform your vehicle into a sanctuary of scent.
            </p>
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', color: '#5C3D2E', lineHeight: 1.9, marginBottom: '2rem', fontWeight: 300 }}>
              Each fragrance in our collection is carefully curated, blending the finest notes to create a lasting impression. From the moment you enter your car, Velaur envelops you in an atmosphere of refined elegance.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #FAE8D0' }}>
              {[
                { num: '20+', label: 'Fragrances' },
                { num: '1K+', label: 'Happy Customers' },
                { num: '100%', label: 'Premium Quality' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#F2A7A7', fontWeight: 400 }}>{stat.num}</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
  @media (max-width: 768px) {
    section > div > div { 
      grid-template-columns: 1fr !important; 
      gap: 2rem !important; 
    }
    section { padding: 3.5rem 0 !important; }
  }
`}</style>
    </section>
  );
}