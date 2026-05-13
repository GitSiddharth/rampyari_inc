'use client';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { openCart, count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div style={{ background: '#1A1A1A', color: '#FAF7F2', textAlign: 'center', padding: '10px', fontSize: '12px', letterSpacing: '0.15em', fontFamily: 'var(--font-body)' }}>
        FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;·&nbsp; USE CODE AURA10 FOR 10% OFF
      </div>

      {/* Main nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,247,242,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E8E4DD',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Left nav links */}
        <div style={{ display: 'flex', gap: '28px', flex: 1 }} className="hidden-mobile">
          {[['Shop', '/shop'], ['Jewellery', '/shop?cat=jewellery'], ['Toys', '/shop?cat=toys'], ['New In', '/shop?sort=new']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: '13px', letterSpacing: '0.08em', color: '#1A1A1A', textDecoration: 'none', fontWeight: 400 }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, letterSpacing: '0.2em', color: '#1A1A1A' }}>
              AURA
            </span>
          </Link>
        </div>

        {/* Right icons */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
          <Search size={18} style={{ cursor: 'pointer', color: '#1A1A1A' }} />
          <User size={18} style={{ cursor: 'pointer', color: '#1A1A1A' }} />
          <button onClick={openCart} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}>
            <ShoppingBag size={18} style={{ color: '#1A1A1A' }} />
            {count > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: '#1A1A1A', color: '#FAF7F2',
                fontSize: '10px', width: '16px', height: '16px',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{count}</span>
            )}
          </button>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} className="show-mobile">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: '108px', left: 0, right: 0, background: 'var(--color-cream)', borderBottom: '1px solid #E8E4DD', padding: '20px 24px', zIndex: 49 }}>
          {[['Shop', '/shop'], ['Jewellery', '/shop?cat=jewellery'], ['Toys', '/shop?cat=toys'], ['New In', '/shop?sort=new']].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: '14px', letterSpacing: '0.08em', color: '#1A1A1A', textDecoration: 'none', borderBottom: '1px solid #E8E4DD' }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}