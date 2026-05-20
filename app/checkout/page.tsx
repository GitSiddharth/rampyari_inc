'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/src/context/CartContext';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, count, closeCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });

  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  // load razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveOrder = async (paymentId: string) => {
  try {
    const { data: customer, error: custError } = await supabase
      .from('customers')
      .insert({
        name: form.name,
        email: form.email || null,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      })
      .select()
      .single();

    if (custError) { alert('Customer error: ' + custError.message); setLoading(false); return; }

    const orderNumber = 'RP' + Date.now().toString().slice(-6);

    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: customer?.id,
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          image: i.images?.[0],
        })),
        subtotal: total,
        shipping: shipping,
        total: grandTotal,
        status: 'confirmed',
        payment_status: 'paid',
        payment_id: paymentId,
      });

    if (orderError) { alert('Order error: ' + orderError.message); setLoading(false); return; }

    const waMessage = encodeURIComponent(
      `🛍️ NEW ORDER - ${orderNumber}\n\n` +
      `👤 ${form.name}\n` +
      `📞 ${form.phone}\n` +
      `📍 ${form.address}, ${form.city} - ${form.pincode}\n\n` +
      `🛒 Items:\n${items.map(i => `${i.name} x${i.qty} = ₹${(i.price * i.qty).toLocaleString()}`).join('\n')}\n\n` +
      `💰 Total: ₹${grandTotal.toLocaleString()}\n` +
      `💳 Payment ID: ${paymentId}`
    );

    window.open(`https://wa.me/916267645056?text=${waMessage}`, '_blank');

    closeCart();
    router.push(`/order-success?order=${orderNumber}`);

  } catch (err: any) {
    alert('Save error: ' + err.message);
    setLoading(false);
  }
};


  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      alert('Please fill all required fields');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!scriptLoaded) {
      alert('Payment system loading, please try again');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });

      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Rampyari Inc',
        description: `${count} item(s) — Shaan. Shringar. Shauq.`,
        order_id: orderData.id,
        handler: async (response: any) => {
          await saveOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#8B1A1A' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 48px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 300, marginBottom: '16px' }}>
          Your cart is empty
        </h2>
        <Link href="/shop" style={{
          fontSize: '12px', letterSpacing: '0.15em', color: '#1A1A1A',
          textDecoration: 'none', borderBottom: '1px solid #1A1A1A',
        }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 48px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
        fontWeight: 300, marginBottom: '48px', textAlign: 'center',
      }}>
        Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }} className="checkout-grid">

        {/* LEFT - delivery form */}
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.2em', marginBottom: '24px', color: '#6B6B6B' }}>
            DELIVERY DETAILS
          </p>

          {[
            { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'Priya Sharma' },
            { label: 'Phone Number *', name: 'phone', type: 'tel', placeholder: '9876543210' },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'priya@email.com' },
            { label: 'Full Address *', name: 'address', type: 'text', placeholder: 'House no, Street, Area' },
            { label: 'City *', name: 'city', type: 'text', placeholder: 'Indore' },
            { label: 'State *', name: 'state', type: 'text', placeholder: 'Madhya Pradesh' },
            { label: 'Pincode *', name: 'pincode', type: 'text', placeholder: '452001' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '11px',
                letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '8px',
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '1px solid #E8E4DD',
                  background: '#FDFAF7',
                  fontSize: '14px', fontFamily: 'var(--font-body)',
                  outline: 'none', color: '#1A1A1A',
                  borderRadius: '2px',
                }}
              />
            </div>
          ))}
        </div>

        {/* RIGHT - order summary */}
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.2em', marginBottom: '24px', color: '#6B6B6B' }}>
            ORDER SUMMARY
          </p>

          {/* items list */}
          <div style={{ marginBottom: '24px' }}>
            {items.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: '12px',
                marginBottom: '16px', paddingBottom: '16px',
                borderBottom: '1px solid #E8E4DD',
              }}>
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '2px' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#6B6B6B' }}>Qty: {item.qty}</p>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>
                  ₹{(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* totals */}
          <div style={{ borderTop: '1px solid #E8E4DD', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#6B6B6B' }}>Subtotal</span>
              <span style={{ fontSize: '13px' }}>₹{total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#6B6B6B' }}>Shipping</span>
              <span style={{ fontSize: '13px', color: shipping === 0 ? '#4A7C59' : '#1A1A1A' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: '11px', color: '#8B1A1A', marginBottom: '16px' }}>
                Add ₹{(99 - total).toLocaleString()} more for free shipping
              </p>
            )}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '24px', paddingTop: '16px',
              borderTop: '2px solid #1A1A1A',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: 600 }}>₹{grandTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              style={{
                width: '100%', padding: '18px',
                background: loading ? '#6B6B6B' : '#8B1A1A',
                color: '#FAF7F2', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px', letterSpacing: '0.2em',
                fontFamily: 'var(--font-body)',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'PROCESSING...' : `PAY ₹${grandTotal.toLocaleString()}`}
            </button>

            <p style={{ fontSize: '11px', color: '#6B6B6B', textAlign: 'center', marginTop: '12px' }}>
              🔒 Secured by Razorpay · UPI · Cards · NetBanking
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}