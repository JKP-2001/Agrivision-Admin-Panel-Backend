require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// const cors = require('cors');

// app.use(cors());

const morgan = require('morgan');
const methodOverride = require('method-override');

app.use(methodOverride())
app.use(morgan("dev"));


const port = process.env.PORT || 5000;

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const adminRoutes = require('./routes/adminRoutes');


// enable CORSn
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, security-key, auth-token,"
    );
    next();
});

app.use((req, res, next) => {

    if (req.originalMethod !== "GET" && req.headers["security-key"] !== process.env.SECURITY_KEY) {
        res.json({"message": "You are not authorized"});
        return;
    }
    next();
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/admin', adminRoutes);



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
