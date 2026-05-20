'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/src/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(form.email, form.password);
      if (error) { setError(error.message); setLoading(false); return; }
      router.push('/profile');
    } else {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill all fields');
        setLoading(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, form.name, form.phone);
      if (error) { setError(error.message); setLoading(false); return; }
      setError('Check your email to confirm your account!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 300, textAlign: 'center', marginBottom: '8px' }}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B6B6B', marginBottom: '40px' }}>
        {isLogin ? 'Sign in to view your orders' : 'Join the Rampyari family'}
      </p>

      {error && (
        <div style={{ padding: '12px 16px', background: error.includes('Check') ? '#F0FFF4' : '#FFF5F5', border: `1px solid ${error.includes('Check') ? '#9AE6B4' : '#FEB2B2'}`, marginBottom: '20px', fontSize: '13px', color: error.includes('Check') ? '#276749' : '#C53030' }}>
          {error}
        </div>
      )}

      {!isLogin && (
        <>
          {[
            { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'Priya Sharma' },
            { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '9876543210' },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '8px' }}>{field.label}</label>
              <input type={field.type} name={field.name} value={form[field.name as keyof typeof form]} onChange={handleChange} placeholder={field.placeholder}
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #E8E4DD', background: '#FDFAF7', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', color: '#1A1A1A' }} />
            </div>
          ))}
        </>
      )}

      {[
        { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'priya@email.com' },
        { label: 'Password *', name: 'password', type: 'password', placeholder: '••••••••' },
      ].map(field => (
        <div key={field.name} style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', color: '#6B6B6B', marginBottom: '8px' }}>{field.label}</label>
          <input type={field.type} name={field.name} value={form[field.name as keyof typeof form]} onChange={handleChange} placeholder={field.placeholder}
            style={{ width: '100%', padding: '14px 16px', border: '1px solid #E8E4DD', background: '#FDFAF7', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', color: '#1A1A1A' }} />
        </div>
      ))}

      <button onClick={handleSubmit} disabled={loading} style={{
        width: '100%', padding: '16px', background: loading ? '#6B6B6B' : '#8B1A1A',
        color: '#FAF7F2', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '12px', letterSpacing: '0.2em', fontFamily: 'var(--font-body)', marginTop: '8px',
      }}>
        {loading ? 'PLEASE WAIT...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B6B6B', marginTop: '24px' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B1A1A', fontSize: '13px', textDecoration: 'underline' }}>
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
}