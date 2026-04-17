const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for the assignment tasks

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an asynchronous call
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = await new Promise((resolve) => {
      const filteredBooks = Object.values(books).filter(b => b.author === author);
      resolve(filteredBooks);
    });
    res.status(200).send(JSON.stringify(getBooksByAuthor, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books by author"});
  }
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve) => {
    const filteredBooks = Object.values(books).filter(b => b.title === title);
    resolve(filteredBooks);
  });

  getBooksByTitle.then((data) => {
    res.status(200).send(JSON.stringify(data, null, 4));
  });
});

module.exports.general = public_users;
