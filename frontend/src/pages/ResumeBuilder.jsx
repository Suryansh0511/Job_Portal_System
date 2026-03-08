import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

export default function ResumeBuilder() {
  const [resumes, setResumes] = useState([]);
  const [form, setForm] = useState({ res_name: '', res_type: 'Generated', res_desc: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const fetch = () => api.getMyResumes().then(d => setResumes(Array.isArray(d) ? d : []));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) { await api.updateResume(editing, form); setMsg('✅ Resume updated!'); setEditing(null); }
    else { await api.createResume(form); setMsg('✅ Resume created!'); }
    setForm({ res_name: '', res_type: 'Generated', res_desc: '' });
    fetch(); setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    await api.deleteResume(id); fetch();
  };

  const typeColor = t => ({ Generated: '#6366f1', PDF: '#f59e0b', DOC: '#10b981' }[t] || '#888');

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.content}>
        <div style={S.top}>
          <div>
            <h1 style={S.title}>My Resumes</h1>
            <p style={S.sub}>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        <div style={S.layout}>
          <div style={S.formCard}>
            <h3 style={S.formTitle}>{editing ? '✏️ Edit Resume' : '+ Create New Resume'}</h3>
            {msg && <div style={S.msg}>{msg}</div>}
            <form onSubmit={handleSubmit}>
              <div style={S.field}>
                <label style={S.label}>Resume Title *</label>
                <input style={S.input} placeholder="e.g. Software Engineer Resume" value={form.res_name}
                  onChange={e => setForm({ ...form, res_name: e.target.value })} required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Type</label>
                <div style={S.typeGrid}>
                  {['Generated', 'PDF', 'DOC'].map(t => (
                    <div key={t} style={{ ...S.typeCard, ...(form.res_type === t ? { background: typeColor(t) + '22', border: `1px solid ${typeColor(t)}55`, color: typeColor(t) } : {}) }}
                      onClick={() => setForm({ ...form, res_type: t })}>{t}</div>
                  ))}
                </div>
              </div>
              <div style={S.field}>
                <label style={S.label}>Summary / Description</label>
                <textarea style={{ ...S.input, height: 110, resize: 'vertical' }}
                  placeholder="Brief summary of your skills and experience..."
                  value={form.res_desc} onChange={e => setForm({ ...form, res_desc: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={S.btn}>{editing ? 'Update Resume' : 'Create Resume'}</button>
                {editing && <button style={S.cancelBtn} type="button" onClick={() => { setEditing(null); setForm({ res_name: '', res_type: 'Generated', res_desc: '' }); }}>Cancel</button>}
              </div>
            </form>
          </div>

          <div style={S.list}>
            {resumes.length === 0 ? (
              <div style={S.empty}><p>No resumes yet. Create your first one!</p></div>
            ) : resumes.map(r => (
              <div key={r.res_id} style={S.resumeCard}>
                <div style={S.resumeLeft}>
                  <div style={{ ...S.resumeIcon, background: typeColor(r.res_type) + '22', color: typeColor(r.res_type) }}>
                    {r.res_type === 'PDF' ? '📑' : r.res_type === 'DOC' ? '📝' : '✨'}
                  </div>
                  <div>
                    <div style={S.resumeName}>{r.res_name}</div>
                    <div style={S.resumeMeta}>
                      <span style={{ ...S.typeBadge, background: typeColor(r.res_type) + '18', color: typeColor(r.res_type) }}>{r.res_type}</span>
                      <span style={S.resumeDate}>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    {r.res_desc && <p style={S.resumeDesc}>{r.res_desc.substring(0, 100)}{r.res_desc.length > 100 ? '...' : ''}</p>}
                  </div>
                </div>
                <div style={S.resumeActions}>
                  <button style={S.editBtn} onClick={() => { setEditing(r.res_id); setForm({ res_name: r.res_name, res_type: r.res_type, res_desc: r.res_desc || '' }); }}>Edit</button>
                  <button style={S.deleteBtn} onClick={() => handleDelete(r.res_id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" },
  content: { maxWidth: 1000, margin: '0 auto', padding: '2.5rem 2rem' },
  top: { marginBottom: '2rem' },
  title: { color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.5 },
  sub: { color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 },
  layout: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' },
  formCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.5rem', position: 'sticky', top: 80 },
  formTitle: { color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 20px' },
  msg: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 },
  field: { marginBottom: 18 },
  label: { display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
  typeGrid: { display: 'flex', gap: 8 },
  typeCard: { flex: 1, padding: '9px', textAlign: 'center', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' },
  btn: { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  cancelBtn: { padding: '12px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, cursor: 'pointer', fontSize: 14 },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  resumeCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' },
  resumeLeft: { display: 'flex', gap: '1rem', flex: 1 },
  resumeIcon: { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  resumeName: { color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6 },
  resumeMeta: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 },
  typeBadge: { padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  resumeDate: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  resumeDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.5, margin: 0 },
  resumeActions: { display: 'flex', gap: 8, flexShrink: 0 },
  editBtn: { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  deleteBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  empty: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 },
};
