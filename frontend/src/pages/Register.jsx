import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', email: '', address: '', username: '', password: '', role_id: '3' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    const res = await api.register(form);
    setLoading(false);
    if (res.error) return setError(res.error);
    navigate('/login');
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.brand}>
          <div style={S.logo}>JP</div>
          <h1 style={S.brandName}>JobPortal</h1>
        </div>
        <div style={S.taglineBlock}>
          <h2 style={S.tagline}>Join thousands of professionals.</h2>
          <p style={S.sub}>Create your free account and take control of your career journey today.</p>
          <div style={S.features}>
            {['✦  Build a professional resume in minutes', '✦  Apply to hundreds of curated jobs', '✦  Track your applications in real-time'].map(f => (
              <p key={f} style={S.feature}>{f}</p>
            ))}
          </div>
        </div>
      </div>

      <div style={S.right}>
        <div style={S.formCard}>
          <h2 style={S.formTitle}>Create account</h2>
          <p style={S.formSub}>Fill in your details to get started</p>
          {error && <div style={S.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={S.row}>
              <div style={S.field}><label style={S.label}>Full Name *</label><input style={S.input} placeholder="Full Name" value={form.name} onChange={set('name')} required /></div>
              <div style={S.field}><label style={S.label}>Mobile</label><input style={S.input} placeholder="Mobile No." value={form.mobile} onChange={set('mobile')} /></div>
            </div>
            <div style={S.field}><label style={S.label}>Email *</label><input style={S.input} type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required /></div>
            <div style={S.field}><label style={S.label}>Address</label><input style={S.input} placeholder="Address" value={form.address} onChange={set('address')} /></div>
            <div style={S.row}>
              <div style={S.field}><label style={S.label}>Username *</label><input style={S.input} placeholder="username" value={form.username} onChange={set('username')} required /></div>
              <div style={S.field}><label style={S.label}>Password *</label><input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required /></div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Register as</label>
              <div style={S.roleGrid}>
                {[['3', '🔍', 'Job Seeker', 'Find and apply to jobs'], ['2', '🏢', 'Recruiter', 'Post jobs & hire talent']].map(([id, icon, title, desc]) => (
                  <div key={id} style={{ ...S.roleCard, ...(form.role_id === id ? S.roleActive : {}) }} onClick={() => setForm({ ...form, role_id: id })}>
                    <span style={S.roleIcon}>{icon}</span>
                    <div><div style={S.roleTitle}>{title}</div><div style={S.roleDesc}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <button style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p style={S.switchText}>Already have an account? <Link to="/login" style={S.link}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#0a0a0f' },
  left: { flex: 1, background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0d1a3a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16 },
  brandName: { color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 },
  taglineBlock: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  tagline: { color: '#fff', fontSize: 38, fontWeight: 700, lineHeight: 1.2, margin: '0 0 16px', letterSpacing: -1 },
  sub: { color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, margin: '0 0 32px' },
  features: { display: 'flex', flexDirection: 'column', gap: 14 },
  feature: { color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 },
  right: { width: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0a0a0f', overflowY: 'auto' },
  formCard: { width: '100%', maxWidth: 460, padding: '2rem 0' },
  formTitle: { color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: -0.5 },
  formSub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 28px' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 10, marginBottom: 18, fontSize: 14 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field: { marginBottom: 16 },
  label: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 7, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none' },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 },
  roleCard: { padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', transition: 'all 0.2s' },
  roleActive: { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.5)' },
  roleIcon: { fontSize: 20 },
  roleTitle: { color: '#fff', fontWeight: 600, fontSize: 13 },
  roleDesc: { color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
  switchText: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 18 },
  link: { color: '#a855f7', textDecoration: 'none', fontWeight: 600 },
};
