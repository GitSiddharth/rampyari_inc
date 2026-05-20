'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';
import { signOut } from '@/src/lib/auth';

type Order = {
  id: string;
  order_number: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: any[];
  tracking_number?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const statusColor: any = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    packed: '#8B5CF6',
    shipped: '#F97316',
    delivered: '#10B981',
    cancelled: '#EF4444',
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '120px', fontSize: '13px', letterSpacing: '0.15em', color: '#6B6B6B' }}>
      LOADING...
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 48px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 300, marginBottom: '8px' }}>
            My Account
          </h1>
          <p style={{ fontSize: '13px', color: '#6B6B6B' }}>{user?.email}</p>
        </div>
        <button onClick={handleSignOut} style={{
          padding: '10px 24px', background: 'none',
          border: '1px solid #E8E4DD', cursor: 'pointer',
          fontSize: '12px', letterSpacing: '0.1em', fontFamily: 'var(--font-body)',
        }}>
          SIGN OUT
        </button>
      </div>

      {/* Orders - fetch by phone since we link by customer */}
      <OrdersList />
    </div>
  );
}

function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchOrders = async () => {
    if (!phone) return;
    setLoading(true);
    const { data: customers } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone);

    if (!customers || customers.length === 0) {
      setOrders([]);
      setSearched(true);
      setLoading(false);
      return;
    }

    const customerIds = customers.map(c => c.id);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('customer_id', customerIds)
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setSearched(true);
    setLoading(false);
  };

  const statusColor: any = {
    pending: '#F59E0B', confirmed: '#3B82F6', packed: '#8B5CF6',
    shipped: '#F97316', delivered: '#10B981', cancelled: '#EF4444',
  };

  return (
    <div>
      <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#6B6B6B', marginBottom: '20px' }}>YOUR ORDERS</p>

      {/* search by phone */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input
          type="tel"
          placeholder="Enter your phone number to see orders"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{
            flex: 1, padding: '12px 16px', border: '1px solid #E8E4DD',
            background: '#FDFAF7', fontSize: '14px',
            fontFamily: 'var(--font-body)', outline: 'none',
          }}
        />
        <button onClick={searchOrders} disabled={loading} style={{
          padding: '12px 24px', background: '#8B1A1A', color: '#FAF7F2',
          border: 'none', cursor: 'pointer', fontSize: '12px',
          letterSpacing: '0.1em', fontFamily: 'var(--font-body)',
        }}>
          {loading ? '...' : 'SEARCH'}
        </button>
      </div>

      {searched && orders.length === 0 && (
        <p style={{ fontSize: '13px', color: '#6B6B6B', textAlign: 'center', padding: '40px' }}>
          No orders found for this number
        </p>
      )}

      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #E8E4DD', marginBottom: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>#{order.order_number}</p>
              <p style={{ fontSize: '12px', color: '#6B6B6B' }}>
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-block', padding: '4px 12px',
                background: statusColor[order.status] + '20',
                color: statusColor[order.status],
                fontSize: '11px', letterSpacing: '0.1em', fontWeight: 500,
                borderRadius: '2px', marginBottom: '4px',
              }}>
                {order.status.toUpperCase()}
              </span>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>₹{order.total.toLocaleString()}</p>
            </div>
          </div>

          {/* items */}
          {order.items?.map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover' }} />}
              <div>
                <p style={{ fontSize: '13px' }}>{item.name}</p>
                <p style={{ fontSize: '12px', color: '#6B6B6B' }}>Qty: {item.qty} · ₹{item.price.toLocaleString()}</p>
              </div>
            </div>
          ))}

          {/* tracking */}
          {order.tracking_number && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#F0FFF4', border: '1px solid #9AE6B4' }}>
              <p style={{ fontSize: '12px', color: '#276749' }}>
                📦 Tracking Number: <strong>{order.tracking_number}</strong>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}