import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = user?.role === 'JobSeeker'
    ? [['Jobs', '/jobs'], ['My Resumes', '/resumes'], ['Applications', '/applications']]
    : user?.role === 'Recruiter'
    ? [['Post Job', '/jobs/post'], ['My Jobs', '/jobs/manage'], ['Applicants', '/applicants']]
    : [['Users', '/admin/users'], ['Jobs', '/admin/jobs'], ['Skills', '/admin/skills'], ['Salary', '/admin/salary']];

  return (
    <nav style={S.nav}>
      <Link to="/" style={S.brand}>
        <div style={S.logo}>JP</div>
        <span style={S.brandName}>JobPortal</span>
      </Link>
      <div style={S.links}>
        {links.map(([label, path]) => (
          <Link key={path} to={path} style={S.link}>{label}</Link>
        ))}
      </div>
      <div style={S.right}>
        <div style={S.userInfo}>
          <div style={S.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={S.userName}>{user?.name}</div>
            <div style={S.userRole}>{user?.role}</div>
          </div>
        </div>
        <button style={S.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  );
}

const S = {
  nav: { display: 'flex', alignItems: 'center', padding: '0 2rem', height: 64, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 100, gap: '2rem' },
  brand: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: '1rem' },
  logo: { width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 13 },
  brandName: { color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: -0.3 },
  links: { display: 'flex', gap: '0.25rem', flex: 1 },
  link: { color: 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, transition: 'all 0.2s' },
  right: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 },
  userName: { color: '#fff', fontSize: 13, fontWeight: 600 },
  userRole: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  logoutBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
};
