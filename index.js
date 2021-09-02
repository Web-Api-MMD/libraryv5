const env = require('dotenv').config(); //{ path: 'custom route/.env' } - if it's not in root
const config = require('config');
const sql = require('mssql');

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST, //localhost for local development
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      trustServerCertificate: false // change to true for local dev / self-signed certs
    }
}

console.log(config);
console.log(env);

const express = require('express'); // require express because we want to use it
const app = express(); // create app with express


const books = require('./routes/books');

app.use(express.json()); // Turns our data in to json data
app.use('/api/books', books);

const myPort = config.get('port'); // defining the port using the environment variable through config

app.listen(myPort, () => console.log(`Listening on port ${myPort}... yo`)); // Make app listen to port
