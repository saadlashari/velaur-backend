import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { addToCart } from '../services/cartService';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(slug)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ paddingTop: 120, textAlign: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#F2A7A7', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading...
    </div>
  );

  if (!product) return null;

  const images = [product.image, product.image2, product.image3].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <main style={{ paddingTop: 90, minHeight: '100vh', background: '#FFFDF9' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Breadcrumb */}
        <p style={{ fontFamily: 'Jost', fontSize: '0.75rem', color: '#8B6F5E', marginBottom: '2.5rem', letterSpacing: '0.08em' }}>
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/')}>Home</span>
          {' / '}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/products')}>Products</span>
          {' / '}
          {product.name}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>

          {/* Images */}
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #FDF0E8, #FAE8D0)',
              aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', overflow: 'hidden',
            }}>
              {images[activeImg] ? (
                <img src={`${images[activeImg]}`} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: '8rem' }}>🌹</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{
                    width: 80, height: 80, cursor: 'pointer',
                    border: `2px solid ${activeImg === i ? '#F2A7A7' : '#FAE8D0'}`,
                    overflow: 'hidden', background: '#FDF0E8',
                    transition: 'border-color 0.2s',
                  }}>
                    <img src={`${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{ fontFamily: 'Jost', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F2A7A7', marginBottom: '0.7rem' }}>
              {product.category_name}
            </p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#2C1810', marginBottom: '0.5rem', fontWeight: 400 }}>
              {product.name}
            </h1>
            {product.scent_notes && (
              <p style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#8B6F5E', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                🌸 Notes: {product.scent_notes}
              </p>
            )}
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#2C1810', marginBottom: '1.5rem' }}>
              Rs. {parseFloat(product.price).toLocaleString()}
            </p>
            <p style={{ fontFamily: 'Jost', fontSize: '0.88rem', color: '#5C3D2E', lineHeight: 1.9, marginBottom: '2rem', fontWeight: 300 }}>
              {product.description}
            </p>

            {/* Details */}
            <div style={{ background: '#FDF0E8', padding: '1.2rem', marginBottom: '2rem', display: 'flex', gap: '2rem' }}>
              <div>
                <div style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E' }}>Volume</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2C1810' }}>{product.volume_ml}ml</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Jost', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B6F5E' }}>Stock</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: product.stock > 0 ? '#2C1810' : '#F2A7A7' }}>
                  {product.stock > 0 ? `${product.stock} available` : 'Sold Out'}
                </div>
              </div>
            </div>

            {/* Qty + Add to Cart */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #FAE8D0' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', padding: '0.7rem 1rem', fontSize: '1.1rem', cursor: 'pointer', color: '#2C1810' }}>−</button>
                  <span style={{ padding: '0 1rem', fontFamily: 'Jost', fontSize: '0.9rem', color: '#2C1810', minWidth: 30, textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ background: 'none', border: 'none', padding: '0.7rem 1rem', fontSize: '1.1rem', cursor: 'pointer', color: '#2C1810' }}>+</button>
                </div>
                <button onClick={handleAddToCart} style={{
                  flex: 1, background: added ? '#F2A7A7' : '#2C1810',
                  color: added ? '#2C1810' : '#FFFDF9', border: 'none',
                  padding: '0.9rem 1.5rem', fontFamily: 'Jost', fontSize: '0.8rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.25s',
                }}>
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            <button onClick={() => navigate('/cart')} style={{
              width: '100%', background: 'transparent', border: '1px solid #2C1810',
              padding: '0.9rem', fontFamily: 'Jost', fontSize: '0.8rem',
              letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', color: '#2C1810',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = '#2C1810'; e.target.style.color = '#FFFDF9'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#2C1810'; }}
            >View Cart</button>
          </div>
        </div>
      </div>

      <style>{`
  @media (max-width: 768px) {
    main > div > div:last-child { 
      grid-template-columns: 1fr !important; 
      gap: 2rem !important; 
    }
  }
`}</style>
    </main>
  );
}