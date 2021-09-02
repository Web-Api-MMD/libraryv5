// this is going to be a class definition - to communicate with the database
const config = require('config');

const sql = require('mssql'); 
const con = config.get('dbConfig_UCN');

const Joi = require('joi');


class Book {
    // class is a blueprint and tells us what a book should look like
    // constructor makes this possible and turns the Book class in to an "actual" book
    // "constructor turns blueprint into an object"
    constructor(bookObj){
        this.bookid = bookObj.bookid;
        this.title = bookObj.title;
        this.year = bookObj.year; 
        this.link = bookObj.link;
    }

    // using joi module to validate if the object is a book
    // creating a static class method (same as a function, but called class method when it's inside a class)
    static validate(bookWannabeObj){
        const schema = Joi.object({
            // set up to rules for the class we're in (book in this case)
            bookid: Joi.number()
                .integer()
                .min(1),
            title: Joi.string()
                .min(1)
                .max(255),
            year: Joi.number()
                .integer(),
            link: Joi.string()
                .uri()
                .max(255)
        });

        return schema.validate(bookWannabeObj);
    }

    static readAll(){
        // Return a promise
        return new Promise((resolve, reject) => {
            (async () => { // Immediately invoked function expression
                // 1. Connect to the DB
                // 2. Ask a question - Send a query to the DB
                // 3. Check if the data is in the correct format
                // 4. If all is good, we can resolve the formatted result
                // 5. If not, reject with error
                // 6. !!!!! CLOSE THE DATABASE CONNECTION

                try {
                    // create pool (mssql terminology)
                    // Connecting to con variable, which comes from our environment variable through our config
                    const pool = await sql.connect(con); //trying to connect to database
                    
                    //ask query to database
                    const result = await pool.request().query(`
                        SELECT * 
                        FROM libexBook
                        `);
                    
                    console.log(result);
                    
                    // validate if the data is in the right format. Iterate through the results
                    // Put all the books in the empty array
                    const books = [];
                    result.recordset.forEach(record => {
                        const newBook = {
                            bookid: record.bookid, 
                            title: record.title, 
                            year: record.year, 
                            link: record.link
                        }

                        const {error} = Book.validate(newBook); 
                        if (error) throw {errorMessage: `Book.validate failed`}; //error if not the right format
                        
                        // Push new book to books array based on newBook
                        books.push(new Book(newBook));
                    });

                    resolve(books); //resolve formatted result 

                } catch(error) {
                    reject(error)
                }

                // 6:
                // Opening a ressource is opened until it is closed. You cannot use that ressource again if you don't close the connection
                // Located here and not in the try/catch block because WE HAVE TO CLOSE the connection no matter what
                sql.close(); // IMPORTANT
                
            })();
        });
    }

}

module.exports = Book;
// access to the Book class for outside this file