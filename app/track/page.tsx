'use client';
import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const statusSteps = ['confirmed', 'packed', 'shipped', 'delivered'];
  const statusColor: any = {
    pending: '#F59E0B', confirmed: '#3B82F6', packed: '#8B5CF6',
    shipped: '#F97316', delivered: '#10B981', cancelled: '#EF4444',
  };

  const search = async () => {
    if (!orderNumber) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    const { data } = await supabase
      .from('orders')
      .select('*, customers(*)')
      .eq('order_number', orderNumber.toUpperCase())
      .single();

    if (!data) setNotFound(true);
    else setOrder(data);
    setLoading(false);
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 300, textAlign: 'center', marginBottom: '8px' }}>
        Track Order
      </h1>
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B6B6B', marginBottom: '48px' }}>
        Enter your order number to track your shipment
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        <input
          type="text"
          placeholder="e.g. RP123456"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          style={{
            flex: 1, padding: '14px 16px', border: '1px solid #E8E4DD',
            background: '#FDFAF7', fontSize: '14px',
            fontFamily: 'var(--font-body)', outline: 'none',
          }}
        />
        <button onClick={search} disabled={loading} style={{
          padding: '14px 28px', background: '#8B1A1A', color: '#FAF7F2',
          border: 'none', cursor: 'pointer', fontSize: '12px',
          letterSpacing: '0.12em', fontFamily: 'var(--font-body)',
        }}>
          {loading ? '...' : 'TRACK'}
        </button>
      </div>

      {notFound && (
        <p style={{ textAlign: 'center', color: '#EF4444', fontSize: '13px' }}>
          Order not found. Please check your order number.
        </p>
      )}

      {order && (
        <div style={{ border: '1px solid #E8E4DD', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '4px' }}>ORDER NUMBER</p>
              <p style={{ fontSize: '18px', fontWeight: 600 }}>#{order.order_number}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '4px' }}>TOTAL</p>
              <p style={{ fontSize: '18px', fontWeight: 600 }}>₹{order.total.toLocaleString()}</p>
            </div>
          </div>

          {/* progress bar */}
          {order.status !== 'cancelled' && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                {statusSteps.map((step, i) => (
                  <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: i <= currentStep ? '#8B1A1A' : '#E8E4DD',
                      margin: '0 auto 8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px',
                    }}>
                      {i <= currentStep ? '✓' : ''}
                    </div>
                    <p style={{ fontSize: '10px', letterSpacing: '0.08em', color: i <= currentStep ? '#8B1A1A' : '#6B6B6B', textTransform: 'uppercase' }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ height: '2px', background: '#E8E4DD', margin: '0 16px', position: 'relative', top: '-40px', zIndex: -1 }}>
                <div style={{ height: '100%', background: '#8B1A1A', width: `${(currentStep / (statusSteps.length - 1)) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          )}

          {order.tracking_number && (
            <div style={{ padding: '16px', background: '#FFF7ED', border: '1px solid #FED7AA', marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', color: '#92400E' }}>
                📦 Tracking Number: <strong>{order.tracking_number}</strong>
              </p>
              <p style={{ fontSize: '11px', color: '#92400E', marginTop: '4px' }}>
                Track on Shiprocket or your courier's website
              </p>
            </div>
          )}

          {/* items */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '16px' }}>ITEMS</p>
            {order.items?.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', objectFit: 'cover' }} />}
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#6B6B6B' }}>Qty: {item.qty} · ₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}