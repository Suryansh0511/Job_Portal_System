// Automatically switch between local & production
const BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api"
    : `${process.env.REACT_APP_API_URL}/api`;

const h = () => {
  const token = localStorage.getItem("jp_token");
  console.log("Token being sent:", token);

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const api = {
  register: (d) =>
    fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  login: (d) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  getJobs: () => fetch(`${BASE}/jobs`, { headers: h() }).then((r) => r.json()),
  getJob: (id) => fetch(`${BASE}/jobs/${id}`, { headers: h() }).then((r) => r.json()),

  createJob: (d) =>
    fetch(`${BASE}/jobs`, {
      method: "POST",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  updateJob: (id, d) =>
    fetch(`${BASE}/jobs/${id}`, {
      method: "PUT",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  deleteJob: (id) =>
    fetch(`${BASE}/jobs/${id}`, {
      method: "DELETE",
      headers: h(),
    }).then((r) => r.json()),

  getMyResumes: () =>
    fetch(`${BASE}/resumes/my`, { headers: h() }).then((r) => r.json()),

  createResume: (d) =>
    fetch(`${BASE}/resumes`, {
      method: "POST",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  updateResume: (id, d) =>
    fetch(`${BASE}/resumes/${id}`, {
      method: "PUT",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  deleteResume: (id) =>
    fetch(`${BASE}/resumes/${id}`, {
      method: "DELETE",
      headers: h(),
    }).then((r) => r.json()),

  getSkills: () =>
    fetch(`${BASE}/skills`, { headers: h() }).then((r) => r.json()),

  addSkill: (d) =>
    fetch(`${BASE}/skills`, {
      method: "POST",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  deleteSkill: (id) =>
    fetch(`${BASE}/skills/${id}`, {
      method: "DELETE",
      headers: h(),
    }).then((r) => r.json()),

  applyJob: (d) =>
    fetch(`${BASE}/applications`, {
      method: "POST",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),

  getMyApplications: () =>
    fetch(`${BASE}/applications/my`, { headers: h() }).then((r) => r.json()),

  getJobApplicants: (id) =>
    fetch(`${BASE}/applications/job/${id}`, { headers: h() }).then((r) => r.json()),

  updateAppStatus: (id, status) =>
    fetch(`${BASE}/applications/${id}/status`, {
      method: "PUT",
      headers: h(),
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),

  getUsers: () =>
    fetch(`${BASE}/admin/users`, { headers: h() }).then((r) => r.json()),

  deleteUser: (id) =>
    fetch(`${BASE}/admin/users/${id}`, {
      method: "DELETE",
      headers: h(),
    }).then((r) => r.json()),

  getSalary: () =>
    fetch(`${BASE}/salary`, { headers: h() }).then((r) => r.json()),

  addSalary: (d) =>
    fetch(`${BASE}/salary`, {
      method: "POST",
      headers: h(),
      body: JSON.stringify(d),
    }).then((r) => r.json()),
};

export default api;