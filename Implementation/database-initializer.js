const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const async = require('async');
const faker = require('faker');
const { fake } = require('faker');
require('dotenv').config({ path: __dirname + '/.env' });

let db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});

var creationFile = fs.readFileSync("./SQL/initializer.sql", {encoding: "UTF-8"});
var insertionFile = fs.readFileSync("./SQL/insertions.sql", {encoding: "UTF-8"});
var triggerFile = fs.readFileSync("./SQL/triggers.sql", {encoding: "UTF-8"});

var stringArray = creationFile.split(";\r");
stringArray.forEach((command, index) => {
    stringArray[index] = command+";";
});

var insertCmdArray = insertionFile.split(");");
insertCmdArray.forEach((command, index) => {
    insertCmdArray[index] = command+");";
});

stringArray.pop();
insertCmdArray.pop();

var instantiateDB = stringArray.splice(0, 2);

const databaseErr = 'Failed to query database';

execute();

async function execute() {
    await makeDB();

    db.end();
    console.log('Disconnected from main SQL server in order to connect to bookstore DB');

    db = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    await makeTables();

    await insertRandomData(20);

    await db.end();
    console.log('Closed connection to fully instantiated database');
}






async function makeDB() {
    try {
        await new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            });
        });
        console.log('MySQL database successfully connected!');
        await instantiateDB.reduce(async(prev, cmd) => {
            await prev;
            await new Promise((resolve, reject) => {
                db.query(cmd, (err, result) => {
                    if (err && err.errno != 1008) {
                        return reject(err);
                    } else if (err && err.errno == 1008) {
                        console.log("Database failed at dropping. If this is the first time running, ignore this");
                        return resolve(result);
                    } else {
                        return resolve(result);
                    }
                });
            });
        }, undefined);
        console.log('New database "bookstore" created');
    
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Failed to log in to MySQL! Check .env credentials');
            process.exit(err.errno);
        }
    }
}

async function makeTables() {
    try {
        await new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            });
        });
        console.log('MySQL bookstore database successfully connected!');
        await stringArray.reduce(async(prev, cmd, index) => {
            await prev;
            console.log("Creating table "+(index+1)+"/"+stringArray.length+"..");
            await new Promise((resolve, reject) => {
                db.query(cmd, (err, result) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(result);
                    }
                });
            })
        }, undefined);

        await new Promise((resolve, reject) => {
            db.query(triggerFile, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    return resolve(result);
                }
            });
        });

        console.log('New tables added to bookstore database');
    
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Failed to log in to MySQL! Check .env credentials');
            process.exit(err.errno);
        }
    }
}


/**
 * @name insertRandomData
 * @description Inserts data into a connected DBMS as db randomly from a pool for a 'quantity' amount of times
 * @param {int} quantity 
 * 
 * @returns {void} 
 */
async function insertRandomData(quantity) {
    
    let publisherNames = [];
    let publisherEmails = [];
    let userEmails = [];
    let ISBN = "1234567891011";

    let lengthArray = Array.apply(null, Array(quantity)).map(function () {});

    await lengthArray.reduce(async(prev, cmd, index) => {
        await prev;
        await new Promise(async (resolve, reject) => {
            console.log('Created record '+(index+1)+'/'+quantity+'..');
            let pubEmail;
            while(true) { //ensure publishers have unique emails
                pubEmail = faker.internet.email();
                if (!publisherEmails.includes(pubEmail)) {
                    break;
                }
            }
            publisherEmails.push(pubEmail);
            let pubName;
            while(true) { //ensure publishers have unique names
                pubName = faker.company.companyName();
                if (!publisherNames.includes(pubName)) {
                    break;
                }
            }
            publisherNames.push(pubName);
            let pubAdd = faker.address.streetAddress(true);
            let pubPhone = faker.datatype.number({max: 9999999999, min: 1000000000});
            let pubAcc = faker.finance.account();
            await new Promise((resolve, reject) => {
                db.query(insertCmdArray[0], [pubName, pubEmail, pubAdd, pubPhone, pubAcc], (err, result) => { //create Publisher records
                    if (err) {
                        // console.error(err);
                    } else {
                        return resolve(result);
                    }
                });
            });
            
            
            let bookGenre = faker.music.genre();
            let bookPrice = faker.datatype.float({min: 0, max: 99, precision: 4});
            let bookName = faker.commerce.productName();
            let bookPageCount = faker.datatype.number({min: 10, max: 500});
            let bookCount = faker.datatype.number({min: 10, max: 50});
            let bookPublisher = publisherNames[Math.floor(Math.random()*publisherNames.length)];
            await new Promise((resolve, reject) => { //create Book records
                db.query(insertCmdArray[1], [ISBN, bookGenre, bookPrice, bookName, bookPageCount, bookCount, bookPublisher], (err, result) => {
                    if (err) {
                        console.error(err);
                    }
                    return resolve(result);
                });    
            });
                        
            let authorName = faker.name.findName();
            await new Promise((resolve, reject) => {
                db.query(insertCmdArray[2], [null, authorName], (err, result) => { //Create author records
                    if (err) { console.log(err); }
                    return resolve(result);
                });
            });
            
            db.query(insertCmdArray[3], [ISBN, index+1]); //Create Written_by records
            if (index == 0){
                db.query(insertCmdArray[6], ['admin', 'admin']); //create Owner record
                db.query(insertCmdArray[7], ['user', 'password', 'testUser', 'email@host.ca', 9111087788]); //create User record
            }
            let tempISBN = Number(ISBN);
            tempISBN++;
            ISBN = ""+tempISBN; //Increase ISBN linearly just for tests
            return resolve();
        }).catch((err)=>{
            console.log(err);
        });
    }, undefined);
    console.log("Inserted "+quantity+" records into Book, Publisher, Author, and Written_by");
    console.log("Created User record with username: user, password: password & Owner with username: admin, password: password for testing")
}