require('dotenv').config(); // ← MUST BE FIRST LINE, before everything else
console.log("DB URL:", process.env.DATABASE_URL);
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api', require('./routes/misc'));

app.get('/', (req, res) => res.json({ message: '🚀 Job Portal API running.' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`));