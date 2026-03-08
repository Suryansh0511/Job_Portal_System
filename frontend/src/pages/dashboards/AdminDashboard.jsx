import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [salary, setSalary] = useState([]);
  const [skillForm, setSkillForm] = useState({ skill_type: '', skill_desc: '' });
  const [salForm, setSalForm] = useState({ sal_emp_id: '', sal_amt: '', sal_desc: '', sal_type: 'Monthly', sal_total: '' });
  const [msg, setMsg] = useState('');

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    api.getUsers().then(d => setUsers(Array.isArray(d) ? d : []));
    api.getJobs().then(d => setJobs(Array.isArray(d) ? d : []));
    api.getSkills().then(d => setSkills(Array.isArray(d) ? d : []));
    api.getSalary().then(d => setSalary(Array.isArray(d) ? d : []));
  }, []);

  const deleteUser = async id => { if (!window.confirm('Delete user?')) return; await api.deleteUser(id); setUsers(users.filter(u => u.user_id !== id)); };
  const deleteJob = async id => { if (!window.confirm('Delete job?')) return; await api.deleteJob(id); setJobs(jobs.filter(j => j.job_id !== id)); };
  const addSkill = async e => { e.preventDefault(); const s = await api.addSkill(skillForm); setSkills([...skills, s]); setSkillForm({ skill_type: '', skill_desc: '' }); flash('✅ Skill added!'); };
  const deleteSkill = async id => { await api.deleteSkill(id); setSkills(skills.filter(s => s.skill_id !== id)); };
  const addSalary = async e => { e.preventDefault(); const s = await api.addSalary(salForm); setSalary([...salary, s]); setSalForm({ sal_emp_id: '', sal_amt: '', sal_desc: '', sal_type: 'Monthly', sal_total: '' }); flash('✅ Salary added!'); };

  const roleColor = r => ({ Admin: '#ef4444', Recruiter: '#f59e0b', JobSeeker: '#10b981' }[r] || '#888');

  const tabs = [['users', '👥 Users'], ['jobs', '💼 Jobs'], ['skills', '🎯 Skills'], ['salary', '💰 Salary']];

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Admin Control Panel</h1>
            <p style={S.sub}>Full system oversight</p>
          </div>
          <div style={S.summaryRow}>
            {[['👥', users.length, 'Users'], ['💼', jobs.length, 'Jobs'], ['🎯', skills.length, 'Skills']].map(([i, n, l]) => (
              <div key={l} style={S.sumCard}><span>{i}</span><span style={S.sumNum}>{n}</span><span style={S.sumLabel}>{l}</span></div>
            ))}
          </div>
        </div>

        <div style={S.tabs}>
          {tabs.map(([key, label]) => (
            <button key={key} style={{ ...S.tab, ...(tab === key ? S.tabActive : {}) }} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {msg && <div style={S.msg}>{msg}</div>}

        {tab === 'users' && (
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead><tr style={S.thead}><th>ID</th><th>Name</th><th>Email</th><th>Username</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id} style={S.tr}>
                    <td style={S.td}>#{u.user_id}</td>
                    <td style={{ ...S.td, color: '#fff', fontWeight: 600 }}>{u.user_name}</td>
                    <td style={S.td}>{u.user_email}</td>
                    <td style={{ ...S.td, fontFamily: 'monospace' }}>{u.login_username}</td>
                    <td style={S.td}><span style={{ ...S.roleBadge, background: roleColor(u.role_name) + '18', color: roleColor(u.role_name), border: `1px solid ${roleColor(u.role_name)}33` }}>{u.role_name}</span></td>
                    <td style={S.td}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={S.td}><button style={S.delBtn} onClick={() => deleteUser(u.user_id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'jobs' && (
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead><tr style={S.thead}><th>ID</th><th>Job Title</th><th>Type</th><th>Vacancies</th><th>Posted By</th><th>Action</th></tr></thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.job_id} style={S.tr}>
                    <td style={S.td}>#{j.job_id}</td>
                    <td style={{ ...S.td, color: '#fff', fontWeight: 600 }}>{j.job_name}</td>
                    <td style={S.td}><span style={S.jobBadge}>{j.job_type || '-'}</span></td>
                    <td style={S.td}>{j.job_vac}</td>
                    <td style={S.td}>{j.posted_by_name || '-'}</td>
                    <td style={S.td}><button style={S.delBtn} onClick={() => deleteJob(j.job_id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'skills' && (
          <div style={S.skillsLayout}>
            <div style={S.card}>
              <h3 style={S.cardTitle}>Add New Skill</h3>
              <form onSubmit={addSkill}>
                <div style={S.field}><label style={S.label}>Skill Name *</label><input style={S.input} placeholder="e.g. React.js" value={skillForm.skill_type} onChange={e => setSkillForm({ ...skillForm, skill_type: e.target.value })} required /></div>
                <div style={S.field}><label style={S.label}>Description</label><input style={S.input} placeholder="Brief description" value={skillForm.skill_desc} onChange={e => setSkillForm({ ...skillForm, skill_desc: e.target.value })} /></div>
                <button style={S.addBtn}>Add Skill</button>
              </form>
            </div>
            <div style={S.card}>
              <h3 style={S.cardTitle}>All Skills ({skills.length})</h3>
              <div style={S.skillList}>
                {skills.map(s => (
                  <div key={s.skill_id} style={S.skillItem}>
                    <div><div style={S.skillName}>{s.skill_type}</div>{s.skill_desc && <div style={S.skillDesc}>{s.skill_desc}</div>}</div>
                    <button style={S.delBtn} onClick={() => deleteSkill(s.skill_id)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'salary' && (
          <div style={S.skillsLayout}>
            <div style={S.card}>
              <h3 style={S.cardTitle}>Add Salary Record</h3>
              <form onSubmit={addSalary}>
                <div style={S.field}><label style={S.label}>Employee ID *</label>
                  <select style={S.input} value={salForm.sal_emp_id} onChange={e => setSalForm({ ...salForm, sal_emp_id: e.target.value })} required>
                    <option value="">Select employee</option>
                    {users.map(u => <option key={u.user_id} value={u.user_id}>{u.user_name}</option>)}
                  </select>
                </div>
                <div style={S.row}><div style={S.field}><label style={S.label}>Amount</label><input style={S.input} type="number" placeholder="50000" value={salForm.sal_amt} onChange={e => setSalForm({ ...salForm, sal_amt: e.target.value })} /></div>
                  <div style={S.field}><label style={S.label}>Total</label><input style={S.input} type="number" placeholder="600000" value={salForm.sal_total} onChange={e => setSalForm({ ...salForm, sal_total: e.target.value })} /></div>
                </div>
                <div style={S.field}><label style={S.label}>Type</label>
                  <div style={S.typeGrid}>{['Monthly', 'Annual', 'Contract'].map(t => <div key={t} style={{ ...S.typeBtn, ...(salForm.sal_type === t ? S.typeActive : {}) }} onClick={() => setSalForm({ ...salForm, sal_type: t })}>{t}</div>)}</div>
                </div>
                <div style={S.field}><label style={S.label}>Notes</label><input style={S.input} placeholder="Any notes..." value={salForm.sal_desc} onChange={e => setSalForm({ ...salForm, sal_desc: e.target.value })} /></div>
                <button style={S.addBtn}>Add Record</button>
              </form>
            </div>
            <div style={S.card}>
              <h3 style={S.cardTitle}>Salary Records ({salary.length})</h3>
              {salary.map(s => (
                <div key={s.sal_id} style={S.salItem}>
                  <div><div style={S.salName}>{s.user_name}</div><div style={S.salType}>{s.sal_type}</div></div>
                  <div style={{ textAlign: 'right' }}><div style={S.salAmt}>₹{Number(s.sal_amt).toLocaleString()}</div><div style={S.salTotal}>Total: ₹{Number(s.sal_total).toLocaleString()}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" },
  content: { maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.5 },
  sub: { color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 },
  summaryRow: { display: 'flex', gap: '1rem' },
  sumCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 },
  sumNum: { color: '#fff', fontWeight: 800, fontSize: 22 },
  sumLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase' },
  tabs: { display: 'flex', gap: 6, marginBottom: '1.5rem' },
  tab: { padding: '9px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  tabActive: { background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.4)', color: '#818cf8' },
  msg: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13 },
  tableWrap: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'rgba(255,255,255,0.05)', textAlign: 'left' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  roleBadge: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  jobBadge: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  delBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500 },
  skillsLayout: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.5rem' },
  cardTitle: { color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 1.2rem' },
  field: { marginBottom: 16 },
  label: { display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, marginBottom: 7, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  addBtn: { padding: '11px 24px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  skillList: { display: 'flex', flexDirection: 'column', gap: 10 },
  skillItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.06)' },
  skillName: { color: '#fff', fontWeight: 600, fontSize: 14 },
  skillDesc: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  typeGrid: { display: 'flex', gap: 8 },
  typeBtn: { flex: 1, padding: '8px', textAlign: 'center', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  typeActive: { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: '#818cf8' },
  salItem: { display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: 9, padding: '12px 14px', marginBottom: 10, border: '1px solid rgba(255,255,255,0.06)' },
  salName: { color: '#fff', fontWeight: 600, fontSize: 14 },
  salType: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  salAmt: { color: '#34d399', fontWeight: 700, fontSize: 16 },
  salTotal: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
};
