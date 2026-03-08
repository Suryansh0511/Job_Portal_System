const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api', require('./routes/misc'));

app.get('/', (req, res) => res.json({ message: '🚀 Job Portal API running.' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`));
