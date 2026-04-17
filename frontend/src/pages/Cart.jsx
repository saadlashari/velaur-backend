import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateQuantity, getCartTotal } from '../services/cartService';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const refresh = () => setCart(getCart());
  useEffect(() => {
    refresh();
    window.addEventListener('cartUpdated', refresh);
    return () => window.removeEventListener('cartUpdated', refresh);
  }, []);

  const total = getCartTotal();

  if (cart.length === 0) return (
    <main style={{ paddingTop: 90, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFDF9' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛍️</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2C1810', marginBottom: '1rem', fontWeight: 400 }}>Your cart is empty</h2>
        <p style={{ fontFamily: 'Jost', fontSize: '0.88rem', color: '#8B6F5E', marginBottom: '2rem' }}>Discover our luxury fragrances and add them to your cart</p>
        <Link to="/products" style={{
          background: '#2C1810', color: '#FFFDF9',
          padding: '0.9rem 2.5rem', fontFamily: 'Jost', fontSize: '0.8rem',
          letterSpacing: '0.2em', textTransform: 'uppercase', display: 'inline-block',
        }}>Shop Now</Link>
      </div>
    </main>
  );

  return (
    <main style={{ paddingTop: 90, minHeight: '100vh', background: '#FFFDF9' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem' }}>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#2C1810', marginBottom: '0.5rem', fontWeight: 400 }}>Your Cart</h1>
        <p style={{ fontFamily: 'Jost', fontSize: '0.8rem', color: '#8B6F5E', marginBottom: '3rem', letterSpacing: '0.1em' }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }}>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'grid', gridTemplateColumns: '100px 1fr auto',
                gap: '1.5rem', alignItems: 'center',
                padding: '1.5rem', background: '#FFFDF9',
                border: '1px solid #FAE8D0',
              }}>
                {/* Image */}
                <div style={{ background: 'linear-gradient(135deg, #FDF0E8, #FAE8D0)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.image ? (
                    <img src={`${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '2rem' }}>🌹</span>}
                </div>

                {/* Info */}
                <div>
                  <Link to={`/products/${item.slug}`} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#2C1810', display: 'block', marginBottom: '0.3rem' }}>{item.name}</Link>
                  {item.scent_notes && <p style={{ fontFamily: 'Jost', fontSize: '0.75rem', color: '#8B6F5E', marginBottom: '0.8rem' }}>{item.scent_notes}</p>}
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2C1810' }}>Rs. {parseFloat(item.price).toLocaleString()}</p>

                  {/* Qty */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.8rem' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: '#FDF0E8', border: '1px solid #FAE8D0', width: 28, height: 28, cursor: 'pointer', fontFamily: 'Jost', fontSize: '1rem', color: '#2C1810' }}>−</button>
                    <span style={{ fontFamily: 'Jost', fontSize: '0.88rem', minWidth: 20, textAlign: 'center', color: '#2C1810' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: '#FDF0E8', border: '1px solid #FAE8D0', width: 28, height: 28, cursor: 'pointer', fontFamily: 'Jost', fontSize: '1rem', color: '#2C1810' }}>+</button>
                  </div>
                </div>

                {/* Subtotal + Remove */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#2C1810', marginBottom: '0.8rem' }}>
                    Rs. {(parseFloat(item.price) * item.quantity).toLocaleString()}
                  </p>
                  <button onClick={() => removeFromCart(item.id)} style={{
                    background: 'none', border: 'none', color: '#F2A7A7',
                    fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.1em',
                    cursor: 'pointer', textTransform: 'uppercase',
                  }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'linear-gradient(135deg, #FDF0E8, #FAE8D0)', padding: '2rem', position: 'sticky', top: 100 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#2C1810', marginBottom: '1.5rem', fontWeight: 400 }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#5C3D2E' }}>Subtotal</span>
              <span style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#2C1810' }}>Rs. {total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#5C3D2E' }}>Shipping</span>
              <span style={{ fontFamily: 'Jost', fontSize: '0.82rem', color: '#2C1810' }}>Calculated at checkout</span>
            </div>

            <div style={{ borderTop: '1px solid rgba(44,24,16,0.1)', paddingTop: '1.2rem', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#2C1810' }}>Total</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#2C1810' }}>Rs. {total.toLocaleString()}</span>
            </div>

            <button onClick={() => navigate('/checkout')} style={{
              width: '100%', background: '#2C1810', color: '#FAE8D0',
              border: 'none', padding: '1rem', fontFamily: 'Jost', fontSize: '0.8rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
              marginBottom: '0.8rem', transition: 'all 0.2s',
            }}>Proceed to Checkout</button>

            <Link to="/products" style={{
              display: 'block', textAlign: 'center',
              fontFamily: 'Jost', fontSize: '0.75rem', color: '#8B6F5E',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>Continue Shopping</Link>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){main > div > div:last-child{grid-template-columns:1fr!important;}}`}</style>
    </main>
  );
}