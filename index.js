const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
require('dotenv').config()
// const dbCOnnection = require('./Config/db')
const bodyParser = require('body-parser')
const cors = require('cors');
const fileUpload = require('express-fileupload')
const dbConnect = require('./Config/mongo')

app.use(cors({
    origin: '*'
}));

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
app.get("/", (req, res) => {
    res.status(200).json({ success: true })
})
app.use('/', require('./Routes/RootRoute'))
dbConnect()


app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
})

