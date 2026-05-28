const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is missing" });
  }
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  } else {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User registered successfully" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const getBooks = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
  };
  getBooks()
    .then((books) => {
      return res.status(200).json(books);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookByISBN = (isbn) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const book = books[isbn];
        resolve(book);
      }, 1000);
    });
  };
  bookByISBN(isbn)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error fetching book" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookByAuthor = (author) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let book = [];
        for (let i in books) {
          if (books[i].author.toLowerCase().includes(author.toLowerCase())) {
            book.push(books[i]);
          }
          resolve(book);
        }
      }, 1000);
    });
  };
  bookByAuthor(author)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error fetching book" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookByTitle = (title) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let book = [];
        for (let i in books) {
          if (books[i].title.toLowerCase().includes(title.toLowerCase())) {
            book.push(books[i]);
          }
        }
        resolve(book);
      }, 1000);
    });
  };
  bookByTitle(title)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error fetching book" });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
