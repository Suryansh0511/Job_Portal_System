import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import ResumeBuilder from './pages/ResumeBuilder';
import Applications from './pages/Applications';
import JobSeekerDashboard from './pages/dashboards/JobSeekerDashboard';
import RecruiterDashboard from './pages/dashboards/RecruiterDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

const Private = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

const DashRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={user.role === 'Admin' ? '/admin' : user.role === 'Recruiter' ? '/recruiter' : '/seeker'} />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashRedirect />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/seeker" element={<Private roles={['JobSeeker']}><JobSeekerDashboard /></Private>} />
      <Route path="/resumes" element={<Private roles={['JobSeeker']}><ResumeBuilder /></Private>} />
      <Route path="/applications" element={<Private roles={['JobSeeker']}><Applications /></Private>} />
      <Route path="/recruiter" element={<Private roles={['Recruiter']}><RecruiterDashboard /></Private>} />
      <Route path="/jobs/post" element={<Private roles={['Recruiter', 'Admin']}><RecruiterDashboard /></Private>} />
      <Route path="/jobs/manage" element={<Private roles={['Recruiter', 'Admin']}><RecruiterDashboard /></Private>} />
      <Route path="/admin" element={<Private roles={['Admin']}><AdminDashboard /></Private>} />
      <Route path="/admin/users" element={<Private roles={['Admin']}><AdminDashboard /></Private>} />
      <Route path="/admin/jobs" element={<Private roles={['Admin']}><AdminDashboard /></Private>} />
      <Route path="/admin/skills" element={<Private roles={['Admin']}><AdminDashboard /></Private>} />
      <Route path="/admin/salary" element={<Private roles={['Admin']}><AdminDashboard /></Private>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
