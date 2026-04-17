import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../services/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getFeaturedProducts().then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  return (
    <main>
      <HeroSection />

      {/* Featured Products */}
      <section style={{ padding: '7rem 0', background: 'linear-gradient(180deg, #FDF0E8 0%, #FFFDF9 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F2A7A7', textAlign: 'center', marginBottom: '0.8rem' }}>
            Curated Collection
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', color: '#2C1810', marginBottom: '0.5rem', fontWeight: 400 }}>
            Featured Fragrances
          </h2>
          <p style={{ fontFamily: 'Jost', fontSize: '0.85rem', textAlign: 'center', color: '#8B6F5E', marginBottom: '3.5rem', letterSpacing: '0.08em' }}>
            Handpicked scents for the discerning driver
          </p>

          {featured.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: 'linear-gradient(135deg, #FDF0E8, #FAE8D0)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🌹</div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products" style={{
              background: 'transparent', color: '#2C1810', border: '1px solid #2C1810',
              padding: '0.9rem 2.5rem', fontFamily: 'Jost', fontSize: '0.78rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', display: 'inline-block',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.target.style.background = '#2C1810'; e.target.style.color = '#FFFDF9'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#2C1810'; }}
            >View All Products</Link>
          </div>
        </div>
      </section>

      <AboutSection />

      {/* Why Velaur */}
      <section style={{ padding: '7rem 0', background: '#2C1810' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F2A7A7', textAlign: 'center', marginBottom: '0.8rem' }}>
            The Velaur Promise
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center', color: '#FAE8D0', marginBottom: '4rem', fontWeight: 400 }}>
            Why Choose Velaur
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
            {[
              { icon: '🌹', title: 'Premium Ingredients', desc: 'Sourced from the finest fragrance houses around the world' },
              { icon: '⏱️', title: 'Long Lasting', desc: 'Our scents last up to 60 days — filling your car with luxury' },
              { icon: '🎁', title: 'Gift Ready', desc: 'Beautifully packaged, perfect for gifting to someone special' },
              { icon: '🚗', title: 'Made for Cars', desc: 'Specially formulated to work perfectly in your vehicle' },
            ].map(f => (
              <div key={f.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#FAE8D0', marginBottom: '0.7rem', fontWeight: 400 }}>{f.title}</h3>
                <p style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#F9D5C0', lineHeight: 1.8, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #F2A7A7, #F9D5C0, #FAE8D0)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#2C1810', marginBottom: '1rem', fontWeight: 400 }}>
            Begin Your Velaur Journey
          </h2>
          <p style={{ fontFamily: 'Jost', fontSize: '0.9rem', color: '#5C3D2E', marginBottom: '2.5rem', lineHeight: 1.8, fontWeight: 300 }}>
            Discover a fragrance that speaks to your soul. Every scent tells a story — let yours begin today.
          </p>
          <Link to="/products" style={{
            background: '#2C1810', color: '#FAE8D0',
            padding: '1rem 3rem', fontFamily: 'Jost', fontSize: '0.8rem',
            letterSpacing: '0.22em', textTransform: 'uppercase', display: 'inline-block',
            transition: 'all 0.3s',
          }}>Explore Collection</Link>
        </div>
      </section>
    </main>
  );
}