import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeCategory) params.category = activeCategory;
    if (sort) params.ordering = sort;
    getProducts(params)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory, sort]);

  return (
    <main style={{ paddingTop: 90, minHeight: '100vh', background: '#FFFDF9' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #F2A7A7, #F9D5C0, #FAE8D0)',
        padding: '4rem 0 3rem',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'Jost', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8B6F5E', marginBottom: '0.8rem' }}>
          Velaur Collection
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#2C1810', fontWeight: 400 }}>
          Our Fragrances
        </h1>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search fragrances..."
            style={{
              border: '1px solid #FAE8D0', padding: '0.7rem 1.2rem',
              fontFamily: 'Jost', fontSize: '0.85rem', color: '#2C1810',
              background: '#FFFDF9', outline: 'none', minWidth: 220,
            }} />

          {/* Categories */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveCategory('')} style={{
              padding: '0.5rem 1.2rem', fontFamily: 'Jost', fontSize: '0.75rem',
              letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              background: activeCategory === '' ? '#2C1810' : 'transparent',
              color: activeCategory === '' ? '#FAE8D0' : '#2C1810',
              border: '1px solid #2C1810', transition: 'all 0.2s',
            }}>All</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                padding: '0.5rem 1.2rem', fontFamily: 'Jost', fontSize: '0.75rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                background: activeCategory === cat.id ? '#2C1810' : 'transparent',
                color: activeCategory === cat.id ? '#FAE8D0' : '#2C1810',
                border: '1px solid #2C1810', transition: 'all 0.2s',
              }}>{cat.name}</button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            border: '1px solid #FAE8D0', padding: '0.7rem 1rem',
            fontFamily: 'Jost', fontSize: '0.82rem', color: '#2C1810',
            background: '#FFFDF9', outline: 'none', cursor: 'pointer',
          }}>
            <option value="">Sort By</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-created_at">Newest First</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#F2A7A7' }}>
            Loading fragrances...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌹</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#8B6F5E' }}>No fragrances found</p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'Jost', fontSize: '0.78rem', color: '#8B6F5E', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
              {products.length} fragrance{products.length !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </main>
  );

  <style>{`
  @media (max-width: 768px) {
    .products-filters { flex-direction: column !important; }
    .products-filters input { width: 100% !important; }
    .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
  }
  @media (max-width: 480px) {
    .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.7rem !important; }
  }
`}</style>
}