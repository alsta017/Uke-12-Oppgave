// Node modules
const express = require("express");
const session = require("express-session")

const bodyParser = require("body-parser");

const mysql = require("mysql");
const bcrypt = require("bcrypt");

var path = require("path");

const app = express();

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for parsing application/json
app.use(bodyParser.json());

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

app.get("/tickets", (req, res) => {
    res.sendFile(__dirname + "/src/html/tickets.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/src/html/login.html");
});

app.get("/newticket", (req, res) => {
    res.sendFile(__dirname + "/src/html/newticket.html");
});

app.post("/newticketcreate", (req, res) => {
    const title = req.body.title;
    const email = req.body.email;
    const description = req.body.description;
    const status = "Åpen";
    const created = new Date();
    connection.query('INSERT INTO tickets (title, email, description, status, created) VALUES (?, ?, ?, ?, ?)', [title, email, description, status, created], function (err, results, fields) {
        if (err) {
            res.status(500).send(err);
            return
        }
        const insertedId = results.insertId;
        res.status(200);
        res.redirect(`/tickets?success=true&id=${insertedId}`);
    })
})

app.post("/ticket/:id", (req, res) => {
    const ticketId = req.params.id;

    connection.query('SELECT * FROM tickets WHERE id = ?', ticketId, (err, results) => {
        if (err) {
            console.error('Error fetching ticket information:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        if (results.length === 0) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        // Convert created date to the desired format (DD.MM.YYYY HH:MM)
        const ticket = results[0];
        const createdDate = new Date(ticket.created);
        const formattedCreatedDate = `${createdDate.getDate().toString().padStart(2, '0')}.${(createdDate.getMonth() + 1).toString().padStart(2, '0')}.${createdDate.getFullYear()} ${createdDate.getHours().toString().padStart(2, '0')}:${createdDate.getMinutes().toString().padStart(2, '0')}`;

        // Update the created property with the formatted date
        ticket.created = formattedCreatedDate;

        // Send ticket information as JSON response
        res.json(ticket);
    });
});