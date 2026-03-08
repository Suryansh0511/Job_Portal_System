import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [view, setView] = useState('dashboard'); // dashboard | post | manage | applicants
  const [form, setForm] = useState({ job_name: '', job_desc: '', job_type: 'Full-time', job_vac: 1, skill_ids: [] });
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(null);

  const fetchJobs = () => api.getJobs().then(d => setJobs(Array.isArray(d) ? d.filter(j => j.posted_by === user?.id) : []));
  useEffect(() => { fetchJobs(); api.getSkills().then(d => setSkills(Array.isArray(d) ? d : [])); }, []);

  const toggleSkill = id => {
    const ids = form.skill_ids.includes(id) ? form.skill_ids.filter(s => s !== id) : [...form.skill_ids, id];
    setForm({ ...form, skill_ids: ids });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (editing) { await api.updateJob(editing, form); setMsg('✅ Job updated!'); setEditing(null); }
    else { await api.createJob(form); setMsg('✅ Job posted!'); }
    setForm({ job_name: '', job_desc: '', job_type: 'Full-time', job_vac: 1, skill_ids: [] });
    fetchJobs(); setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await api.deleteJob(id); fetchJobs();
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    const data = await api.getJobApplicants(job.job_id);
    setApplicants(Array.isArray(data) ? data : []);
    setView('applicants');
  };

  const updateStatus = async (appId, status) => {
    await api.updateAppStatus(appId, status);
    const data = await api.getJobApplicants(selectedJob.job_id);
    setApplicants(Array.isArray(data) ? data : []);
  };

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        {view === 'dashboard' && (
          <>
            <div style={S.hero}>
              <div>
                <h1 style={S.greeting}>Recruiter Panel</h1>
                <p style={S.greetingSub}>Welcome back, {user?.name}</p>
              </div>
              <div style={S.statRow}>
                {[['📋', jobs.length, 'Active Jobs'], ['👥', jobs.reduce((a, j) => a + (j.job_vac || 0), 0), 'Total Vacancies']].map(([icon, n, l]) => (
                  <div key={l} style={S.statCard}><span>{icon}</span><span style={S.statNum}>{n}</span><span style={S.statLabel}>{l}</span></div>
                ))}
              </div>
            </div>
            <div style={S.actionGrid}>
              {[['➕ Post New Job', 'post', '#6366f1'], ['📋 Manage Jobs', 'manage', '#a855f7'], ['👥 View Applicants', 'manage', '#10b981']].map(([label, v, color]) => (
                <button key={label} style={{ ...S.actionBtn, background: color + '15', border: `1px solid ${color}40`, color }} onClick={() => setView(v)}>{label}</button>
              ))}
            </div>
          </>
        )}

        {(view === 'post' || editing) && (
          <div style={S.formCard}>
            <div style={S.formHeader}>
              <h2 style={S.formTitle}>{editing ? '✏️ Edit Job' : '➕ Post a New Job'}</h2>
              <button style={S.backBtn} onClick={() => { setView('dashboard'); setEditing(null); setForm({ job_name: '', job_desc: '', job_type: 'Full-time', job_vac: 1, skill_ids: [] }); }}>← Back</button>
            </div>
            {msg && <div style={S.msg}>{msg}</div>}
            <form onSubmit={handlePost}>
              <div style={S.row}>
                <div style={S.field}><label style={S.label}>Job Title *</label><input style={S.input} placeholder="e.g. Frontend Developer" value={form.job_name} onChange={e => setForm({ ...form, job_name: e.target.value })} required /></div>
                <div style={S.field}><label style={S.label}>Vacancies</label><input style={S.input} type="number" min="1" value={form.job_vac} onChange={e => setForm({ ...form, job_vac: e.target.value })} /></div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Job Type</label>
                <div style={S.typeGrid}>
                  {['Full-time', 'Part-time', 'Internship', 'Remote'].map(t => (
                    <div key={t} style={{ ...S.typeBtn, ...(form.job_type === t ? S.typeActive : {}) }} onClick={() => setForm({ ...form, job_type: t })}>{t}</div>
                  ))}
                </div>
              </div>
              <div style={S.field}><label style={S.label}>Description</label><textarea style={{ ...S.input, height: 130, resize: 'vertical' }} placeholder="Describe the role, requirements, and benefits..." value={form.job_desc} onChange={e => setForm({ ...form, job_desc: e.target.value })} /></div>
              <div style={S.field}>
                <label style={S.label}>Required Skills</label>
                <div style={S.skillGrid}>
                  {skills.map(s => (
                    <span key={s.skill_id} style={{ ...S.skillTag, ...(form.skill_ids.includes(s.skill_id) ? S.skillActive : {}) }} onClick={() => toggleSkill(s.skill_id)}>{s.skill_type}</span>
                  ))}
                </div>
              </div>
              <button style={S.submitBtn}>{editing ? 'Update Job' : 'Post Job →'}</button>
            </form>
          </div>
        )}

        {view === 'manage' && !editing && (
          <div>
            <div style={S.manageHeader}>
              <h2 style={S.formTitle}>My Job Postings</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={S.postNewBtn} onClick={() => setView('post')}>+ Post New Job</button>
                <button style={S.backBtn} onClick={() => setView('dashboard')}>← Back</button>
              </div>
            </div>
            {jobs.length === 0 ? <div style={S.empty}>No jobs posted yet.</div> : jobs.map(j => (
              <div key={j.job_id} style={S.jobCard}>
                <div>
                  <h4 style={S.jobName}>{j.job_name}</h4>
                  <div style={S.jobMeta}>
                    <span style={S.jobBadge}>{j.job_type}</span>
                    <span style={S.jobVac}>🪑 {j.job_vac} vacancies</span>
                  </div>
                </div>
                <div style={S.jobActions}>
                  <button style={S.viewAppBtn} onClick={() => viewApplicants(j)}>👥 Applicants</button>
                  <button style={S.editJobBtn} onClick={() => { setEditing(j.job_id); setForm({ job_name: j.job_name, job_desc: j.job_desc, job_type: j.job_type, job_vac: j.job_vac, skill_ids: [] }); }}>Edit</button>
                  <button style={S.deleteJobBtn} onClick={() => handleDelete(j.job_id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'applicants' && selectedJob && (
          <div>
            <div style={S.manageHeader}>
              <h2 style={S.formTitle}>Applicants for: {selectedJob.job_name}</h2>
              <button style={S.backBtn} onClick={() => setView('manage')}>← Back</button>
            </div>
            {applicants.length === 0 ? <div style={S.empty}>No applicants yet.</div> : applicants.map(a => (
              <div key={a.app_id} style={S.appCard}>
                <div style={S.appLeft}>
                  <div style={S.appAvatar}>{a.user_name[0]}</div>
                  <div>
                    <div style={S.appName}>{a.user_name}</div>
                    <div style={S.appEmail}>{a.user_email}</div>
                    {a.res_name && <div style={S.appResume}>📄 {a.res_name}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select style={S.statusSelect} value={a.status} onChange={e => updateStatus(a.app_id, e.target.value)}>
                    {['Pending', 'Reviewed', 'Accepted', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                  </select>
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
  content: { maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  greeting: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.5 },
  greetingSub: { color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 },
  statRow: { display: 'flex', gap: '1rem' },
  statCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statNum: { color: '#fff', fontWeight: 800, fontSize: 24 },
  statLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  actionGrid: { display: 'flex', gap: '1rem' },
  actionBtn: { flex: 1, padding: '1.5rem', borderRadius: 14, cursor: 'pointer', fontSize: 15, fontWeight: 700, transition: 'all 0.2s' },
  formCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '2rem' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  formTitle: { color: '#fff', fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.3 },
  backBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  msg: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px 14px', borderRadius: 8, marginBottom: 18, fontSize: 13 },
  row: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 },
  field: { marginBottom: 18 },
  label: { display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  typeGrid: { display: 'flex', gap: 8 },
  typeBtn: { padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  typeActive: { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: '#818cf8' },
  skillGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  skillTag: { padding: '6px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13 },
  skillActive: { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#34d399' },
  submitBtn: { padding: '13px 32px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 700 },
  manageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  postNewBtn: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  jobCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  jobName: { color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 8px' },
  jobMeta: { display: 'flex', gap: 10, alignItems: 'center' },
  jobBadge: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  jobVac: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  jobActions: { display: 'flex', gap: 8 },
  viewAppBtn: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  editJobBtn: { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  deleteJobBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  appCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  appLeft: { display: 'flex', gap: '1rem', alignItems: 'center' },
  appAvatar: { width: 42, height: 42, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 },
  appName: { color: '#fff', fontWeight: 700, fontSize: 14 },
  appEmail: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 3 },
  appResume: { color: '#818cf8', fontSize: 12, marginTop: 3 },
  statusSelect: { padding: '8px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' },
  empty: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 },
};
