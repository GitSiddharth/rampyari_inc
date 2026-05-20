'use client';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div onClick={closeCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 98 }} />}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
        background: 'var(--color-cream)', zIndex: 99,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid #E8E4DD',
        maxWidth: '100vw',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E8E4DD' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, letterSpacing: '0.1em' }}>
            YOUR BAG {items.length > 0 && `(${items.reduce((s,i)=>s+i.qty,0)})`}
          </span>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B6B6B' }}>
              <ShoppingBag size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p style={{ fontSize: '13px', letterSpacing: '0.1em' }}>YOUR CART IS EMPTY</p>
              <Link href="/shop" onClick={closeCart} style={{ display: 'inline-block', marginTop: '16px', fontSize: '12px', color: '#1A1A1A', textDecoration: 'underline', letterSpacing: '0.1em' }}>
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #E8E4DD' }}>
              <img src={item.images?.[0]} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{item.name}</p>
                <p style={{ fontSize: '12px', color: '#6B6B6B', marginBottom: '12px' }}>₹{item.price.toLocaleString()}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: 'none', border: '1px solid #E8E4DD', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Minus size={10} />
                  </button>
                  <span style={{ fontSize: '13px', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: 'none', border: '1px solid #E8E4DD', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Plus size={10} />
                  </button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', color: '#6B6B6B' }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #E8E4DD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', letterSpacing: '0.08em' }}>SUBTOTAL</span>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>₹{total.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#6B6B6B', marginBottom: '16px' }}>Taxes and shipping calculated at checkout</p>
           // replace with this
<Link
  href="/checkout"
  onClick={closeCart}
  style={{
    display: 'block', width: '100%', padding: '16px',
    background: '#8B1A1A', color: '#FAF7F2',
    textDecoration: 'none', fontSize: '12px',
    letterSpacing: '0.15em', fontFamily: 'var(--font-body)',
    textAlign: 'center',
  }}
>
  CHECKOUT
</Link>
          </div>
        )}
      </div>
    </>
  );
}