'use client';
import { useState } from 'react';
import Link from 'next/link';

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="#FAF7F2"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FAF7F2">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FAF7F2">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="#B8965A" stroke="#B8965A" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#1A1A1A', color: '#FAF7F2', marginTop: '80px' }}>

      {/* Newsletter strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '48px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
          JOIN THE FAMILY
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, marginBottom: '24px' }}>
          Get 10% off your first order
        </h3>
        {subscribed ? (
          <p style={{ fontSize: '13px', color: '#B8965A', letterSpacing: '0.1em' }}>
            ✓ THANK YOU FOR SUBSCRIBING
          </p>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '420px', margin: '0 auto' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              style={{
                flex: 1, padding: '14px 20px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRight: 'none',
                color: '#FAF7F2', fontSize: '13px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
            <button type="submit" style={{
              padding: '14px 24px',
              background: '#B8965A', border: 'none',
              color: '#FAF7F2', fontSize: '11px',
              letterSpacing: '0.15em', cursor: 'pointer',
              fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
            }}>
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>

      {/* Main footer grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '40px', padding: '60px 48px',
        maxWidth: '1200px', margin: '0 auto',
      }}>

        {/* Brand */}
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 300, letterSpacing: '0.2em', marginBottom: '16px' }}>
            RAMPYARI
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 2, marginBottom: '24px' }}>
            Handcrafted jewellery, toys<br />and gifts made with love<br />from Indore, India.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[InstagramIcon, TwitterIcon, FacebookIcon].map((Icon, i) => (
              <button key={i} style={{
                background: 'rgba(255,255,255,0.08)', border: 'none',
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '20px', color: 'rgba(255,255,255,0.5)' }}>SHOP</p>
          {[
            ['All Products', '/shop'],
            ['Jewellery', '/shop?cat=jewellery'],
            ['Toys', '/shop?cat=toys'],
            ['New Arrivals', '/shop?sort=new'],
            ['Sale', '/shop?sort=sale'],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{
              display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none', marginBottom: '12px',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F2')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Help links */}
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '20px', color: 'rgba(255,255,255,0.5)' }}>HELP</p>
          {[
            ['About Us', '/about'],
            ['Contact Us', '/contact'],
            ['Shipping Policy', '/shipping'],
            ['Returns & Exchanges', '/returns'],
            ['FAQ', '/faq'],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{
              display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none', marginBottom: '12px',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F2')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '20px', color: 'rgba(255,255,255,0.5)' }}>CONTACT</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', lineHeight: 1.8 }}>
            Indore, Madhya Pradesh<br />India
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
            hello@rampyari.in
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Mon–Sat, 10am–7pm IST
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
          © 2025 RAMPYARI INC. ALL RIGHTS RESERVED.
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          MADE WITH <HeartIcon /> IN INDORE
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Privacy Policy', 'Terms of Service'].map(label => (
            <Link key={label} href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.08em' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  );
}