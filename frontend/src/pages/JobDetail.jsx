import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.getJob(id).then(d => { setJob(d); setLoading(false); });
    if (user?.role === 'JobSeeker') api.getMyResumes().then(d => setResumes(Array.isArray(d) ? d : []));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    const res = await api.applyJob({ job_id: id, res_id: selectedResume || null });
    setApplying(false);
    if (res.error) return setMsg('❌ ' + res.error);
    setMsg('✅ Application submitted successfully!');
  };

  if (loading) return <div style={S.page}><Navbar /><div style={S.loading}>Loading...</div></div>;
  if (!job || job.error) return <div style={S.page}><Navbar /><div style={S.loading}>Job not found.</div></div>;

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        <button style={S.back} onClick={() => navigate('/jobs')}>← Back to Jobs</button>
        <div style={S.layout}>
          <div style={S.main}>
            <div style={S.header}>
              <div style={S.avatar}>{job.job_name[0]}</div>
              <div>
                <h1 style={S.title}>{job.job_name}</h1>
                <div style={S.meta}>
                  <span style={S.badge}>{job.job_type || 'Full-time'}</span>
                  <span style={S.metaText}>🪑 {job.job_vac} opening{job.job_vac !== 1 ? 's' : ''}</span>
                  {job.posted_by_name && <span style={S.metaText}>Posted by {job.posted_by_name}</span>}
                </div>
              </div>
            </div>

            <div style={S.section}>
              <h3 style={S.sectionTitle}>Job Description</h3>
              <p style={S.desc}>{job.job_desc || 'No description provided.'}</p>
            </div>

            {job.skills?.length > 0 && (
              <div style={S.section}>
                <h3 style={S.sectionTitle}>Required Skills</h3>
                <div style={S.skills}>
                  {job.skills.map(s => <span key={s.skill_id || s} style={S.skill}>{s.skill_type || s}</span>)}
                </div>
              </div>
            )}
          </div>

          {user?.role === 'JobSeeker' && (
            <div style={S.sidebar}>
              <h3 style={S.sideTitle}>Apply Now</h3>
              {msg ? (
                <div style={{ ...S.msgBox, background: msg.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.startsWith('✅') ? '#34d399' : '#f87171' }}>{msg}</div>
              ) : (
                <>
                  <p style={S.sideDesc}>Choose a resume to submit with your application (optional)</p>
                  {resumes.length > 0 && (
                    <select style={S.select} value={selectedResume} onChange={e => setSelectedResume(e.target.value)}>
                      <option value="">No resume selected</option>
                      {resumes.map(r => <option key={r.res_id} value={r.res_id}>{r.res_name}</option>)}
                    </select>
                  )}
                  {resumes.length === 0 && (
                    <p style={S.noResume}>You have no resumes. <span style={S.createLink} onClick={() => navigate('/resumes')}>Create one →</span></p>
                  )}
                  <button style={{ ...S.applyBtn, opacity: applying ? 0.7 : 1 }} onClick={handleApply} disabled={applying}>
                    {applying ? 'Submitting...' : '🚀 Apply for this Job'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" },
  content: { maxWidth: 1000, margin: '0 auto', padding: '2rem' },
  back: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, marginBottom: '1.5rem', padding: 0 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' },
  main: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '2rem' },
  header: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  avatar: { width: 60, height: 60, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, flexShrink: 0 },
  title: { color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 0 10px', letterSpacing: -0.5 },
  meta: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  badge: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  metaText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  section: { marginBottom: '2rem' },
  sectionTitle: { color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 12px' },
  desc: { color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.8, margin: 0 },
  skills: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  skill: { background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 },
  sidebar: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', position: 'sticky', top: 80 },
  sideTitle: { color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 0 8px' },
  sideDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' },
  select: { width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, marginBottom: 14, boxSizing: 'border-box' },
  applyBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  noResume: { color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 14 },
  createLink: { color: '#a855f7', cursor: 'pointer', fontWeight: 600 },
  msgBox: { padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 500, marginBottom: 8 },
  loading: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '5rem', fontSize: 16 },
};
