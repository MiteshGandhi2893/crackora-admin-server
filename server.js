const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require("cors");

dotenv.config();    
connectDB();

const app = express();
app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: ['http://localhost:5173', 'http://localhost:5174','https://crackora-admin-git-main-miteshgandhi2893s-projects.vercel.app', 'https://crackora-admin.netlify.app', 'http://localhost:3000', 'https://crackora-admin.com', 'https://www.crackora-admin.com']
}));

app.use(express.json());
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/exams'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
