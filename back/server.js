require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const msgRoutes = require('./routes/messages');
const adRoutes = require('./routes/ads');

const app = express();
app.use(express.json());
app.use(cors());

if (!process.env.MONGO_URI) {
  console.warn('WARNING: MONGO_URI not set in environment. Edit .env or set MONGO_URI to connect to MongoDB Atlas.');
}

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-news');

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/messages', msgRoutes);
app.use('/api/ads', adRoutes);

// optional: seed admin route (development only) - remove before production
app.get('/seed-admin', async (req, res) => {
  const User = require('./models/User');
  try {
    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) return res.json({ message: 'Admin exists' });
    const u = await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' });
    res.json({ message: 'Admin created', user: { email: u.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
