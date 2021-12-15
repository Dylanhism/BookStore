const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const async = require('async');
require('dotenv').config({ path: __dirname + './env' });

const app = express();
app.use(express.json);
app.use(cors);
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname +'/public'));

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Failed to log in to MySQL! Check .env credentials');
            process.exit(err.errno);
        }
    } else {
        console.log('MySQL database successfully connected!');
    }
});

const databaseErr = 'Failed to query database';

/*
app.get('/products/:id', (req, res) => {
    db.query("SELECT name, price, quantity FROM products WHERE id = ?;", [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send(databaseErr);
        } else {
            if (results.length === 0) res.status(404).send('Product not found');
            else res.status(200).send(results[0]);
        }
    });

});
*/