require('dotenv').config(); // MUST be first
console.log("DB URL:", process.env.DATABASE_URL);

const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Better CORS setup (production-safe)
app.use(cors({
  origin: [
    "http://localhost:3000", // local frontend
    "https://job-portal-system-seven-zeta.vercel.app" // your Vercel frontend
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api', require('./routes/misc'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Job Portal API running.' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server on port ${PORT}`);
});