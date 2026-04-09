import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await api.login(form);
    setLoading(false);
    if (res.error) return setError(res.error);
    login(res.user, res.token);
    const role = res.user.role;
    if (role === 'Admin') navigate('/admin');
    else if (role === 'Recruiter') navigate('/recruiter');
    else navigate('/seeker');
  };

  return (
    <div style={S.page}>
      <div style={S.left}>
        <div style={S.brand}>
          <div style={S.logo}>JP</div>
          <h1 style={S.brandName}>JobPortal</h1>
        </div>
        <div style={S.taglineBlock}>
          <h2 style={S.tagline}>Your next opportunity<br />starts here.</h2>
          <p style={S.sub}>Connect with top companies, build your resume, and land the job you deserve.</p>
        </div>
      </div>

      <div style={S.right}>
        <div style={S.formCard}>
          <h2 style={S.formTitle}>Welcome back</h2>
          <p style={S.formSub}>Sign in to your account</p>

          {error && <div style={S.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={S.field}>
              <label style={S.label}>Username</label>
              <input style={S.input} placeholder="Enter your username" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input style={S.input} type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button style={{ ...S.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={S.switchText}>Don't have an account? <Link to="/register" style={S.link}>Create one</Link></p>

          <div style={S.divider}><span style={S.divText}>Demo Credentials</span></div>
          <div style={S.demoGrid}>
            {[['Admin', 'admin / admin123'], ['Recruiter', 'recruiter / pass123'], ['Job Seeker', 'seeker / pass123']].map(([role, cred]) => (
              <div key={role} style={S.demoCard}>
                <span style={S.demoRole}>{role}</span>
                <span style={S.demoCred}>{cred}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#0a0a0f' },
  left: { flex: 1, background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0d1a3a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', position: 'relative', overflow: 'hidden' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16, letterSpacing: 1 },
  brandName: { color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 },
  taglineBlock: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  tagline: { color: '#fff', fontSize: 42, fontWeight: 700, lineHeight: 1.2, margin: '0 0 20px', letterSpacing: -1 },
  sub: { color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.7, maxWidth: 380, margin: 0 },
  stats: { display: 'flex', gap: '2.5rem' },
  stat: { display: 'flex', flexDirection: 'column', gap: 4 },
  statNum: { color: '#a855f7', fontWeight: 800, fontSize: 24 },
  statLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },

  right: { width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0a0a0f' },
  formCard: { width: '100%', maxWidth: 400 },
  formTitle: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px', letterSpacing: -0.5 },
  formSub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 32px' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 },
  field: { marginBottom: 20 },
  label: { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500, marginBottom: 8, letterSpacing: 0.3 },
  input: { width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 8, letterSpacing: 0.3 },
  switchText: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 20 },
  link: { color: '#a855f7', textDecoration: 'none', fontWeight: 600 },
  divider: { position: 'relative', margin: '24px 0 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' },
  divText: { position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#0a0a0f', padding: '0 12px', color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  demoGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  demoCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  demoRole: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 },
  demoCred: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'monospace' },
};
