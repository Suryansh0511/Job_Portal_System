import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getJobs().then(d => { setJobs(Array.isArray(d) ? d : []); setLoading(false); }); }, []);

  const types = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote'];
  const filtered = jobs.filter(j => {
    const matchSearch = j.job_name.toLowerCase().includes(search.toLowerCase()) || (j.job_desc || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filter === 'All' || j.job_type === filter;
    return matchSearch && matchType;
  });

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        <div style={S.topBar}>
          <div>
            <h1 style={S.title}>Find Your Next Role</h1>
            <p style={S.sub}>{jobs.length} opportunities available</p>
          </div>
          <input style={S.search} placeholder="🔍  Search jobs, skills, companies..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={S.filters}>
          {types.map(t => (
            <button key={t} style={{ ...S.filterBtn, ...(filter === t ? S.filterActive : {}) }} onClick={() => setFilter(t)}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div style={S.loading}>Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}><p>No jobs found matching your search.</p></div>
        ) : (
          <div style={S.grid}>
            {filtered.map(j => (
              <div key={j.job_id} style={S.card} onClick={() => navigate(`/jobs/${j.job_id}`)}>
                <div style={S.cardTop}>
                  <div style={S.companyAvatar}>{j.job_name[0]}</div>
                  <span style={S.typeBadge}>{j.job_type || 'Full-time'}</span>
                </div>
                <h3 style={S.jobName}>{j.job_name}</h3>
                <p style={S.jobDesc}>{(j.job_desc || '').substring(0, 90)}{j.job_desc?.length > 90 ? '...' : ''}</p>
                <div style={S.skills}>
                  {(j.skills || []).slice(0, 4).map(s => <span key={s} style={S.skill}>{s}</span>)}
                </div>
                <div style={S.cardBottom}>
                  <span style={S.vac}>🪑 {j.job_vac} opening{j.job_vac !== 1 ? 's' : ''}</span>
                  <button style={S.applyBtn}>View →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" },
  content: { maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.5 },
  sub: { color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 },
  search: { padding: '12px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, width: 340, outline: 'none' },
  filters: { display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '7px 18px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.2s' },
  filterActive: { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.5)', color: '#818cf8' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  companyAvatar: { width: 42, height: 42, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 },
  typeBadge: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  jobName: { color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 8px' },
  jobDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px' },
  skills: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' },
  skill: { background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '3px 10px', borderRadius: 12, fontSize: 12 },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' },
  vac: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  applyBtn: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  loading: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '5rem 0', fontSize: 16 },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '5rem 0', fontSize: 16 },
};
