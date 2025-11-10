const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require("cors");
const path = require('path');
dotenv.config();    
connectDB();

const app = express();
app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: ['http://localhost:5173', 'http://localhost:5174',"https://crackora-admin.vercel.app", 'http://localhost:3000', 'https://admin.crackora.com', 'https://www.admin.crackora.com']
}));

app.use(express.json());
app.use("/coursepackages", express.static(path.join(__dirname, "public/coursepackages")));
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/exams'));
app.use('/api/course-packages', require('./routes/CoursePackage'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
