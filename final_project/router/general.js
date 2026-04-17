const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous fetch of the books object
        const getBooks = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(books);
                }, 100);
            });
        };

        const bookList = await getBooks();
        res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const getBookByISBN = new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        }, 100);
    });

    getBookByISBN
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = await new Promise((resolve) => {
            setTimeout(() => {
                const filteredBooks = Object.values(books).filter(b => b.author === author);
                resolve(filteredBooks);
            }, 100);
        });
        
        if (getBooksByAuthor.length > 0) {
            res.status(200).send(JSON.stringify(getBooksByAuthor, null, 4));
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    
    const getBooksByTitle = new Promise((resolve) => {
        setTimeout(() => {
            const filteredBooks = Object.values(books).filter(b => b.title === title);
            resolve(filteredBooks);
        }, 100);
    });

    getBooksByTitle.then((filteredBooks) => {
        if (filteredBooks.length > 0) {
            res.status(200).send(JSON.stringify(filteredBooks, null, 4));
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
