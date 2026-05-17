'use client';
import { useState, useEffect } from 'react';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { Product } from '@/src/data/products';
import ProductCard from '@/src/components/ProductCard';
import { useCart } from '@/src/context/CartContext';

const ChevronRight = () => <span style={{ color: '#6B6B6B', fontSize: '10px' }}>›</span>;
const MinusIcon = () => <span style={{ fontSize: '16px', lineHeight: 1 }}>−</span>;
const PlusIcon = () => <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>;
const BagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!data) { setLoading(false); router.push('/not-found'); return; }
      setProduct(data);

      const { data: rel } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(4);

      setRelated(rel || []);
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '120px', fontSize: '13px', letterSpacing: '0.15em', color: '#6B6B6B' }}>
      LOADING...
    </div>
  );

  if (!product) return null;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ padding: '16px 48px', borderBottom: '1px solid #E8E4DD', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ fontSize: '11px', color: '#6B6B6B', textDecoration: 'none', letterSpacing: '0.08em' }}>HOME</Link>
        <ChevronRight />
        <Link href="/shop" style={{ fontSize: '11px', color: '#6B6B6B', textDecoration: 'none', letterSpacing: '0.08em' }}>SHOP</Link>
        <ChevronRight />
        <span style={{ fontSize: '11px', color: '#1A1A1A', letterSpacing: '0.08em' }}>{product.name.toUpperCase()}</span>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: '1200px', margin: '0 auto', padding: '48px' }} className="product-grid">
        
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {product.badge && (
            <span style={{
              position: 'absolute', top: '16px', left: '16px',
              background: product.badge === 'Sale' ? '#1A1A1A' : '#B8965A',
              color: '#FAF7F2', fontSize: '10px', padding: '4px 10px', letterSpacing: '0.12em',
            }}>{product.badge}</span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '0 0 0 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#6B6B6B', marginBottom: '12px' }}>
            {product.category.toUpperCase()}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 300, marginBottom: '16px', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '20px', fontWeight: 500 }}>₹{product.price.toLocaleString()}</span>
            {product.original_price && (
              <>
                <span style={{ fontSize: '16px', color: '#6B6B6B', textDecoration: 'line-through' }}>
                  ₹{product.original_price.toLocaleString()}
                </span>
                <span style={{ fontSize: '12px', color: '#B8965A', fontWeight: 500 }}>
                  {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.8, marginBottom: '32px' }}>
            {product.description}
          </p>

          <div style={{ width: '40px', height: '1px', background: '#E8E4DD', marginBottom: '32px' }} />

          {/* Qty */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', marginBottom: '12px' }}>QUANTITY</p>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8E4DD', width: 'fit-content' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '44px', height: '44px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MinusIcon />
              </button>
              <span style={{ width: '44px', textAlign: 'center', fontSize: '14px' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: '44px', height: '44px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button onClick={handleAdd} style={{
            width: '100%', padding: '18px',
            background: added ? '#4A7C59' : '#1A1A1A',
            color: '#FAF7F2', border: 'none', cursor: 'pointer',
            fontSize: '12px', letterSpacing: '0.2em',
            fontFamily: 'var(--font-body)', transition: 'background 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            marginBottom: '12px',
          }}>
            <BagIcon />
            {added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
          </button>

          <p style={{ fontSize: '11px', color: '#6B6B6B', textAlign: 'center', letterSpacing: '0.08em' }}>
            FREE SHIPPING ON ORDERS ABOVE ₹999
          </p>

          <div style={{ width: '40px', height: '1px', background: '#E8E4DD', margin: '32px 0' }} />

          <div style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 2 }}>
            <p>📦 Ships within 2–4 business days</p>
            <p>↩ 7-day easy returns</p>
            <p>✦ Handcrafted with care</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ padding: '60px 48px', borderTop: '1px solid #E8E4DD' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, marginBottom: '36px', textAlign: 'center' }}>
            You May Also Like
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; padding: 24px !important; }
          .product-grid > div:last-child { padding-left: 0 !important; padding-top: 32px; }
        }
      `}</style>
    </div>
  );
}