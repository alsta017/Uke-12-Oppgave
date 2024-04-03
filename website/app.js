// Node modules
const express = require("express");
const session = require("express-session")

const mysql = require("mysql");
const bcrypt = require("bcrypt");

var path = require("path");

const app = express();

var port = 80;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "IMKuben1337!",
    database: "uke12db",
});

app.use(session({
    secret: 'y*u52xD7FuZz8aGt',
    resave: false,
    saveUninitialized: false
}));

// Bruk mappe /src
app.use('/src', express.static(path.join(__dirname + '/src')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/html/index.html");
});