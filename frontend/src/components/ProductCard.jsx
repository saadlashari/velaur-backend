import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../services/cartService';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link to={`/products/${product.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        background: '#FFFDF9',
        border: '1px solid #FAE8D0',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'none',
        boxShadow: hovered ? '0 20px 40px rgba(242,167,167,0.2)' : '0 2px 8px rgba(242,167,167,0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Product Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1', background: 'linear-gradient(135deg, #FDF0E8, #FAE8D0)' }}>
        {product.image ? (
          <img src={`${product.image}`} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🌹</div>
        )}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,253,249,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Jost', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B6F5E' }}>Sold Out</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: '1.2rem' }}>
        <p style={{ fontFamily: 'Jost', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F2A7A7', marginBottom: '0.4rem' }}>
          {product.category_name || 'Velaur'}
        </p>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#2C1810', marginBottom: '0.3rem', fontWeight: 400 }}>
          {product.name}
        </h3>
        {product.scent_notes && (
          <p style={{ fontFamily: 'Jost', fontSize: '0.75rem', color: '#8B6F5E', marginBottom: '0.8rem' }}>
            {product.scent_notes}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2C1810' }}>
            Rs. {parseFloat(product.price).toLocaleString()}
          </span>
          <button onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              background: added ? '#F2A7A7' : '#2C1810',
              color: added ? '#2C1810' : '#FFFDF9',
              border: 'none',
              padding: '0.5rem 1rem',
              fontFamily: 'Jost',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              opacity: product.stock === 0 ? 0.5 : 1,
            }}>
            {added ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}