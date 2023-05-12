const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dbConnect = require('./Config/mongo');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://linkeble-2f2f5.web.app',
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});

app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);


app.use(
    fileUpload({
        useTempFiles: true,
    })
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use('/', require('./Routes/RootRoute'));

// Set up a basic WebSocket connection with the frontend
io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for chat messages from the frontend
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);

        // Broadcast the received message to all connected clients
        io.emit('chat message', msg);
    });

    // Log when a user disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/error', (req, res, next) => {
    const err = new Error('This is an error');
    err.status = 400;
    next(err);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

dbConnect();

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong!';

    return res.status(errorStatus).json({ success: false, error: errorMessage });
});

// Change app.listen to server.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// uzair chutyia ha