const express = require('express'); // require express because we want to use it
const router = express.Router(); // router variable becuase here we are creating routes
const Book = require('../models/book'); // Requiring the book class from Models/book.js

router.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json'); // Set header to send json data
    // need to call the book class for DB access
    try {
        const books = await Book.readAll(); // Calling a static function on the Book class. 
        // The readAll() is a static class method in the book.js file bacuase it is a blueprint. We don't know what's in the 
        // database and we don't have a book object, so that's why we're doing this. 
        return res.send(JSON.stringify(books)); 
        // send back json version of the books
    } catch (err) {
        return res.status(500).send(JSON.stringify({message: err})); // internal server error status code
    }
});

module.exports = router; // We're exporting the router
