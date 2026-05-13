'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Product } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';

const categoryTabs = ['All', 'Jewellery', 'Toys', 'Accessories'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState('All');
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (active !== 'All') {
        query = query.eq('category', active.toLowerCase());
      }

      if (sort === 'low') query = query.order('price', { ascending: true });
      else if (sort === 'high') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [active, sort]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#6B6B6B', marginBottom: '12px' }}>RAMPYARI INC</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300 }}>
          All Products
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categoryTabs.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: '8px 20px', border: '1px solid',
              borderColor: active === cat ? '#1A1A1A' : '#E8E4DD',
              background: active === cat ? '#1A1A1A' : 'transparent',
              color: active === cat ? '#FAF7F2' : '#1A1A1A',
              fontSize: '12px', letterSpacing: '0.1em',
              cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
            }}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#6B6B6B', letterSpacing: '0.08em' }}>
            {products.length} PRODUCTS
          </span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: '8px 16px', border: '1px solid #E8E4DD',
            background: 'var(--color-cream)', fontSize: '12px',
            letterSpacing: '0.08em', cursor: 'pointer',
            fontFamily: 'var(--font-body)', color: '#1A1A1A', outline: 'none',
          }}>
            <option value="default">SORT: FEATURED</option>
            <option value="low">PRICE: LOW TO HIGH</option>
            <option value="high">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.15em' }}>LOADING...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B6B6B' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.1em' }}>NO PRODUCTS FOUND</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px 24px' }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}