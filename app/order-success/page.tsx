'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useCart } from '@/src/context/CartContext';

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');
  const { closeCart } = useCart();

  useEffect(() => {
    closeCart();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '100px 48px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(32px, 5vw, 56px)',
        fontWeight: 300, marginBottom: '16px',
      }}>
        Order Placed!
      </h1>
      <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.8, marginBottom: '8px' }}>
        Thank you for shopping with Rampyari Inc.
      </p>
      {orderNumber && (
        <p style={{ fontSize: '13px', color: '#8B1A1A', marginBottom: '32px', letterSpacing: '0.15em', fontWeight: 500 }}>
          ORDER #{orderNumber}
        </p>
      )}
      <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 2, marginBottom: '40px' }}>
        We'll pack your order with love and ship within 2–4 business days.<br />
        You'll receive updates on WhatsApp.
      </p>
      <Link href="/shop" style={{
        display: 'inline-block', padding: '16px 40px',
        background: '#8B1A1A', color: '#FAF7F2',
        textDecoration: 'none', fontSize: '12px',
        letterSpacing: '0.2em', fontFamily: 'var(--font-body)',
      }}>
        CONTINUE SHOPPING
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '120px' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}