const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const async = require('async');
const e = require('express');
require('dotenv').config({ path: __dirname + '/.env' });

let app = express();
//Instead of using html files, use .pug files which is just html templates that are editable
app.set("view engine", "pug");

app.use(express.json());
app.use(cors());
app.use(session({   //session to hold temp data for cart
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

//app.use(express.static(__dirname +'/public'));

const db = mysql.createConnection({ //setup connection to database 'bookstore'
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => { //attempt to connect to database
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
let databaseSelects = fs.readFileSync("./SQL/selections.sql", {encoding: "UTF-8"}); //read selections.sql file
let databaseInserts = fs.readFileSync("./SQL/insertions.sql", {encoding: "UTF-8"});
let selectCmds = databaseSelects.split(";"); //turn it into seperate strings to be executable later
let insertCmds = databaseInserts.split(";");
selectCmds.forEach((command, index) => {
    selectCmds[index] = command+";";
});
insertCmds.forEach((command, index) => {
    insertCmds[index] = command+";";
});

app.get('/', (req, res) => { //very basic querying into database based on query values in URL
    if (Object.keys(req.query).length == 0) { //If no queries, just load the search bar
        res.status(200).render("main", {});
    } else if (req.query.ISBN) { 
        db.query(selectCmds[0], [req.query.ISBN], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send(databaseErr);
            } else {
                res.status(200).render("main", {books: results});
            }
        });
    } else if (req.query.name) {
        db.query(selectCmds[1], [req.query.name], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send(databaseErr);
            } else {
                res.status(200).render("main", {books: results});
            }
        });
    } else if (req.query.genre) {
        db.query(selectCmds[2], [req.query.genre], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send(databaseErr);
            } else {
                res.status(200).render("main", {books: results});
            }
        });
    } else if (req.query.author) {
        db.query(selectCmds[3], [req.query.author], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send(databaseErr);
            } else {
                res.status(200).render("main", {books: results});
            }
        });
    }
});

app.get('/books/:isbn', (req, res) => { //specific book by isbn view and all the data associated
    db.query(selectCmds[4], [req.params.isbn], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send(databaseErr);
        } else {
            res.status(200).render("book", {book: results[0]});
        }
    });
});

app.get('/client', (req, res) => { //sending javascript file
	res.set('Content-Type', 'text/javascript');
	res.status(200).sendFile(__dirname + '/public/client.js');
});

app.get('/cart', (req, res) => {
    // cartString = req.session.cart.join();
    if (req.session.cart) {
        let query = selectCmds[5].slice(0, selectCmds[5].length-3)+Object.keys(req.session.cart).join()+');';

        db.query(query, (err, result) => {
            res.status(200).render("cart", {books: result, quantities: req.session.cart});
        });    
    } else {
        res.status(200).render('cart', {});
    }
    
});

app.get('/checkout', (req, res) => {
    if (req.session.user == undefined) {
        res.status(401).send('Login to checkout');
    } else {
        res.status(200).render('checkout');
    }
});

app.post('/books/:ISBN', (req, res) => { //Store all ISBN into cart regardless of logged in or quantity of books is correct
    if (req.session.cart) {
        if (req.session.cart[req.body.isbn] != undefined) {
            req.session.cart[req.body.isbn] = req.session.cart[req.body.isbn]+1;
        } else {
            req.session.cart[req.body.isbn] = 1; //session which temporarily holds data instead of putting carts into databases
        }
    } else {
        req.session.cart = {};
        req.session.cart[req.body.isbn] = 1;
    }
    res.status(200).send();
});

app.post('/users', (req, res) => {
    db.query(selectCmds[6], [req.body.username, req.body.password], (err, result) => {
        if (result != undefined && result != []) {
            req.session.user = 'user';
            res.status(200).send();
        } else {
            res.status(500).send(); //shouldn't happen in test application
        }
    });
});

app.post('/owners', (req, res) => {
    db.query(selectCmds[7], [req.body.username, req.body.password], (err, result) => {
        if (result != undefined && result != []) {
            req.session.owner = 'admin';
            res.status(200).send();
        } else {
            res.status(500).send(); //shouldn't happen in test application
        }
    });
});

app.post('/cart', (req, res) => {
    if (req.session.user != undefined) {
        res.status(302).send();
    } else {
        res.status(401).send();
    }
});

app.post('/checkout', (req, res) => { //receive billing and address info from logged in user on checkout page. Create Order and Order_contains
    db.query(insertCmds[4], [null, 'At warehouse', 'warehouse st. L4F5M1 Canada Ontario', req.body.address, req.session.user], (err, result) => { //make a new order record
        if (err) console.log(err);
        db.query(selectCmds[8], (err, result) => { //get latest record ID that we just inserted from Order
            if (err) console.log(err);
            Object.keys(req.session.cart).forEach(async(ISBN) => {
                await new Promise((resolve, reject) => {
                    db.query(insertCmds[5], [result[0].order_ID, ISBN, req.session.cart[ISBN]], (err, result) => { //insert linking record in order_contains
                        return resolve();
                    });
                });
            });
            res.setHeader('Content-Type', 'application/json')
            res.status(302).send({ID: result[0].order_ID});
        });
    });
});


app.listen(8000, () => {
    console.log('Express app started on port localhost:8000');
});