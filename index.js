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
const { sendMessage } = require('./Controllers/Chat/Message');

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

// export the io object so that it can be used in the root route
module.exports.io = io;

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

// Set up a WebSocket connection with the frontend
// io.on('connection', (socket) => {
//     console.log('New WebSocket connection');

//     // Listen for chatMessage event from client
//     socket.on('chatMessage', (message, callback) => {
//       // Import sendMessage from route file

//       // Call sendMessage
//       sendMessage(message, (response) => {
//         // Emit event to client with the message status
//         if (response.success) {
//           io.emit('message', response.message); // Emit the saved message to all clients
//         }
//         if (callback && typeof callback === "function") {
//           callback(response);
//         }
//       });
//     });
//   });
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('chatMessage', (message, callback) => {
        sendMessage(message, (response) => {
            if (response.success) {
                io.emit('message', response.message);
            }
            if (callback && typeof callback === "function") {
                callback(response);
            }
        });
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

