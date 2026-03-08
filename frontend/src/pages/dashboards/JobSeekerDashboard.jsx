import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    api.getJobs().then(d => setJobs(Array.isArray(d) ? d.slice(0, 3) : []));
    api.getMyApplications().then(d => setApps(Array.isArray(d) ? d : []));
    api.getMyResumes().then(d => setResumes(Array.isArray(d) ? d : []));
  }, []);

  const statusColor = s => ({ Pending: '#f59e0b', Reviewed: '#6366f1', Accepted: '#10b981', Rejected: '#ef4444' }[s] || '#888');

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        <div style={S.hero}>
          <div>
            <h1 style={S.greeting}>Good day, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={S.greetingSub}>Here's your career overview</p>
          </div>
          <div style={S.statRow}>
            {[['📋', apps.length, 'Applications'], ['📄', resumes.length, 'Resumes'], ['✅', apps.filter(a => a.status === 'Accepted').length, 'Accepted']].map(([icon, n, l]) => (
              <div key={l} style={S.statCard}><span style={S.statIcon}>{icon}</span><span style={S.statNum}>{n}</span><span style={S.statLabel}>{l}</span></div>
            ))}
          </div>
        </div>

        <div style={S.grid}>
          <div style={S.section}>
            <div style={S.sectionHead}>
              <h3 style={S.sectionTitle}>Latest Jobs</h3>
              <button style={S.seeAll} onClick={() => navigate('/jobs')}>See all →</button>
            </div>
            {jobs.length === 0 ? <p style={S.empty}>No jobs available yet.</p> : jobs.map(j => (
              <div key={j.job_id} style={S.jobCard} onClick={() => navigate(`/jobs/${j.job_id}`)}>
                <div style={S.jobTop}>
                  <h4 style={S.jobName}>{j.job_name}</h4>
                  <span style={S.jobBadge}>{j.job_type || 'Full-time'}</span>
                </div>
                <p style={S.jobDesc}>{j.job_desc?.substring(0, 80)}...</p>
                <div style={S.jobSkills}>
                  {(j.skills || []).slice(0, 3).map(s => <span key={s} style={S.skill}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div style={S.section}>
            <div style={S.sectionHead}>
              <h3 style={S.sectionTitle}>My Applications</h3>
              <button style={S.seeAll} onClick={() => navigate('/applications')}>See all →</button>
            </div>
            {apps.length === 0 ? <p style={S.empty}>No applications yet. Start applying!</p> : apps.slice(0, 4).map(a => (
              <div key={a.app_id} style={S.appCard}>
                <div>
                  <div style={S.appJob}>{a.job_name}</div>
                  <div style={S.appType}>{a.job_type}</div>
                </div>
                <span style={{ ...S.statusBadge, background: statusColor(a.status) + '22', color: statusColor(a.status), border: `1px solid ${statusColor(a.status)}44` }}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.quickActions}>
          {[['🔍 Browse All Jobs', '/jobs', '#6366f1'], ['📄 Build Resume', '/resumes', '#a855f7'], ['📋 My Applications', '/applications', '#10b981']].map(([label, path, color]) => (
            <button key={path} style={{ ...S.quickBtn, background: color + '18', border: `1px solid ${color}44`, color }} onClick={() => navigate(path)}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" },
  content: { maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' },
  greeting: { color: '#fff', fontSize: 30, fontWeight: 700, margin: '0 0 6px', letterSpacing: -0.5 },
  greetingSub: { color: 'rgba(255,255,255,0.4)', fontSize: 15, margin: 0 },
  statRow: { display: 'flex', gap: '1rem' },
  statCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 90 },
  statIcon: { fontSize: 20 },
  statNum: { color: '#fff', fontWeight: 800, fontSize: 22 },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
  section: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem' },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' },
  sectionTitle: { color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 },
  seeAll: { background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  jobCard: { background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem', marginBottom: 10, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' },
  jobTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  jobName: { color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 },
  jobBadge: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  jobDesc: { color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: '0 0 8px', lineHeight: 1.5 },
  jobSkills: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  skill: { background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '2px 8px', borderRadius: 12, fontSize: 11 },
  appCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 10, border: '1px solid rgba(255,255,255,0.06)' },
  appJob: { color: '#fff', fontWeight: 600, fontSize: 13 },
  appType: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  empty: { color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '1.5rem 0' },
  quickActions: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  quickBtn: { padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, flex: 1, minWidth: 180 },
};
