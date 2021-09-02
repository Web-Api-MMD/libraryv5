const env = require('dotenv').config();
console.log(env);
const config = require('config');
console.log(config);


const express = require('express');
const app = express();
const books = require('./routes/books');

app.use(express.json());
app.use('/api/books', books);

//const myPort = process.env.PORT;
const myPort = config.get('port');

app.listen(myPort, () => console.log(`Listening on port ${myPort}...`));
