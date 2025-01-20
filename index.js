require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParse = require('cookie-parser');
const { connectDB } = require('./db/connection.js');
const authRoute = require('./routes/auth.route');
const workspaceRoute = require('./routes/workspace.route.js');
const morgan = require('morgan')
const app = express();
const server = require('http').createServer(app);


connectDB();


app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(cookieParse(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))


// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/workspace', workspaceRoute);


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
})
