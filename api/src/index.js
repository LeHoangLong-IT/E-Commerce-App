// Require Package
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const prisma = require('./config/prisma');

// Middleware
const app = express();
const port = process.env.PORT || 3001;


const path = require("path");

// 👇 cho phép truy cập ảnh qua URL
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🔥 CORS phải đặt TRƯỚC routes
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

routes(app);

// Test API
app.get('/', (req, res) => {
    res.send('Backend chạy thành công...');
});

// Connect PostgreSQL & Start Server
async function startServer() {
    try {
        await prisma.$connect();

        console.log('✅ PostgreSQL connected successfully!');

        app.listen(port, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❌ PostgreSQL connection failed:', error);
    }
}

startServer();