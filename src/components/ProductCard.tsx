'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';

const CartIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();

  const image = product.images?.[0] || 'https://via.placeholder.com/400x500?text=No+Image';
  const hoverImage = product.images?.[1] || image;

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link href={`/product/${product.slug}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '3/4', textDecoration: 'none' }}>
        <img
          src={hovered ? hoverImage : image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
        />
        {product.badge && (
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            background: product.badge === 'Sale' ? '#1A1A1A' : '#B8965A',
            color: '#FAF7F2', fontSize: '10px', padding: '4px 8px', letterSpacing: '0.1em',
          }}>{product.badge}</span>
        )}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#1A1A1A' }}>SOLD OUT</span>
          </div>
        )}
        {product.stock > 0 && (
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            style={{
              position: 'absolute', bottom: '12px', left: '50%',
              transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(120%)',
              transition: 'transform 0.3s ease',
              background: 'var(--color-cream)', border: '1px solid #1A1A1A',
              padding: '10px 20px', fontSize: '11px', letterSpacing: '0.12em',
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
               display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <CartIcon /> QUICK ADD
          </button>
        )}
      </Link>
      <div style={{ paddingTop: '12px' }}>
        <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: '#1A1A1A' }}>
          <p style={{ fontSize: '13px', marginBottom: '4px' }}>{product.name}</p>
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 500 }}>₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <span style={{ fontSize: '12px', color: '#6B6B6B', textDecoration: 'line-through' }}>₹{product.original_price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}