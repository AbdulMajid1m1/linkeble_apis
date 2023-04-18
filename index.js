
const express = require('express')
const app = express()

// error handling middleware 
const PORT = process.env.PORT || 5000
require('dotenv').config()
// const dbCOnnection = require('./Config/db')
const bodyParser = require('body-parser')
const cors = require('cors');
const fileUpload = require('express-fileupload')
const dbConnect = require('./Config/mongo')
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:3000",
    "https://linkeble-2f2f5.web.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            // If the origin is not in the allowedOrigins list or it's not provided, block the request
            if (!origin || !allowedOrigins.includes(origin)) {
                return callback(new Error("Not allowed by CORS"), false);
            }
            // If the origin is allowed, proceed with the request
            return callback(null, true);
        },
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
app.use('/', require('./Routes/RootRoute'))
app.get('/error', (req, res, next) => {
    const err = new Error('This is an error');
    err.status = 400;
    next(err);
})


// test error handling middleware

app.get("/", (req, res) => {
    // res.status(200).json({ success: true })
    res.sendFile(__dirname + '/home.html');
})

dbConnect()

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).json({ success: false, error: errorMessage })
})

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
})