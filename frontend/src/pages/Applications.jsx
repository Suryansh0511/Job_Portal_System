import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getMyApplications().then(d => { setApps(Array.isArray(d) ? d : []); setLoading(false); }); }, []);

  const statusStyle = s => ({
    Pending:  { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
    Reviewed: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
    Accepted: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
    Rejected: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  }[s] || { bg: 'rgba(255,255,255,0.07)', color: '#aaa', border: 'rgba(255,255,255,0.15)' });

  const counts = ['Pending', 'Reviewed', 'Accepted', 'Rejected'].map(s => [s, apps.filter(a => a.status === s).length]);

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        <h1 style={S.title}>My Applications</h1>
        <p style={S.sub}>{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>

        <div style={S.statsRow}>
          {counts.map(([s, n]) => {
            const c = statusStyle(s);
            return (
              <div key={s} style={{ ...S.statCard, background: c.bg, border: `1px solid ${c.border}` }}>
                <span style={{ ...S.statNum, color: c.color }}>{n}</span>
                <span style={{ ...S.statLabel, color: c.color }}>{s}</span>
              </div>
            );
          })}
        </div>

        {loading ? <p style={S.empty}>Loading...</p>
          : apps.length === 0 ? <div style={S.emptyBox}><p>You haven't applied to any jobs yet.</p></div>
          : apps.map(a => {
            const c = statusStyle(a.status);
            return (
              <div key={a.app_id} style={S.card}>
                <div style={S.left}>
                  <div style={S.jobAvatar}>{a.job_name[0]}</div>
                  <div>
                    <div style={S.jobName}>{a.job_name}</div>
                    <div style={S.meta}>
                      {a.job_type && <span style={S.typeBadge}>{a.job_type}</span>}
                      <span style={S.date}>Applied {new Date(a.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <span style={{ ...S.statusBadge, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{a.status}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" },
  content: { maxWidth: 800, margin: '0 auto', padding: '2.5rem 2rem' },
  title: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.5 },
  sub: { color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: '0 0 2rem' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 120, borderRadius: 12, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' },
  statNum: { fontWeight: 800, fontSize: 28 },
  statLabel: { fontSize: 13, fontWeight: 600 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  left: { display: 'flex', gap: '1rem', alignItems: 'center' },
  jobAvatar: { width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 },
  jobName: { color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6 },
  meta: { display: 'flex', gap: 10, alignItems: 'center' },
  typeBadge: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  date: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  statusBadge: { padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem 0' },
  emptyBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 },
};
