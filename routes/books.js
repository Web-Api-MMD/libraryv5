const express = require('express');
const router = express.Router();

const Book = require('../models/book');


router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // need to call the Book class for DB access...
    try {
        const books = await Book.readAll();
        return res.send(JSON.stringify(books));
    } catch (err) {
        return res.status(500).send(JSON.stringify({message: err}));
    }
});

router.post('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // need to validate the req.body (aka the data) that came with the request
    // if good, then try to send the data to the DB
    // if bad, then error with 400 bad request
    
    // validate
    const {error} = Book.validate(req.body);
    if (error) return res.status(400).send(JSON.stringify({message: `Bad request. ${error.details[0].message}`}));

    const newBook = new Book(req.body);

    try {
        const bookFromTheDB = await newBook.create();
        return res.send(JSON.stringify(bookFromTheDB));
    } catch(err) {
        return res.status(500).send(JSON.stringify({message: err}));
    }

});


module.exports = router;