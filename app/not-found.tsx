import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '48px',
    }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#6B6B6B', marginBottom: '16px' }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 300, marginBottom: '16px' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '40px', maxWidth: '400px', lineHeight: 1.8 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" style={{
        padding: '14px 36px', background: '#1A1A1A', color: '#FAF7F2',
        textDecoration: 'none', fontSize: '11px', letterSpacing: '0.2em',
        fontFamily: 'var(--font-body)',
      }}>
        BACK TO HOME
      </Link>
    </div>
  );
}