import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartCount } from '../services/cartService';
import { isLoggedIn, logoutUser } from '../services/authService';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    setCartCount(getCartCount());
    const onUpdate = () => setCartCount(getCartCount());
    window.addEventListener('cartUpdated', onUpdate);
    return () => window.removeEventListener('cartUpdated', onUpdate);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/cart', label: 'Cart' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,253,249,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(242,167,167,0.15)' : 'none',
      transition: 'all 0.4s ease',
      padding: scrolled ? '1rem 0' : '1.5rem 0',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.8rem',
            fontWeight: 400,
            color: '#2C1810',
            letterSpacing: '0.1em'
          }}>🌹 Velaur</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.78rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: location.pathname === link.to ? '#F2A7A7' : '#2C1810',
              fontWeight: location.pathname === link.to ? 500 : 300,
              transition: 'color 0.2s',
              borderBottom: location.pathname === link.to ? '1px solid #F2A7A7' : 'none',
              paddingBottom: '2px',
            }}>{link.label}</Link>
          ))}

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative' }}>
            <span style={{ fontSize: '1.2rem' }}>🛍️</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -8,
                background: '#F2A7A7', color: '#2C1810',
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 500,
              }}>{cartCount}</span>
            )}
          </Link>

          {/* Auth */}
          {loggedIn ? (
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid #2C1810',
              padding: '0.5rem 1.2rem', fontFamily: 'Jost, sans-serif',
              fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#2C1810', cursor: 'pointer', transition: 'all 0.2s',
            }}>Logout</button>
          ) : (
            <Link to="/auth" style={{
              background: '#2C1810', color: '#FFFDF9',
              padding: '0.5rem 1.2rem', fontFamily: 'Jost, sans-serif',
              fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}>Login</Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'none', border: 'none', fontSize: '1.5rem', display: 'none'
        }} className="hamburger">☰</button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#FFFDF9', padding: '1rem 2rem 2rem',
          display: 'flex', flexDirection: 'column', gap: '1.2rem',
          borderTop: '1px solid #FAE8D0',
        }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2C1810' }}
            >{link.label}</Link>
          ))}
          {!loggedIn && <Link to="/auth" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', color: '#F2A7A7' }}>Login / Register</Link>}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}