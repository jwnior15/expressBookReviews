const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let user = users.find((user) => user.username === username);
  return user === undefined;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validUser = users.find((user) => {
    return user.username === username && user.password === password;
  });
  return validUser !== undefined;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is missing" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const accessToken = jwt.sign({ username }, "secretKey");
  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).json({ message: "Login successful", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;
  if (!review) {
    return res.status(400).json({ message: "Review is missing" });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review;
  } else {
    books[isbn].reviews[username] = review;
  }
  return res.status(200).json({ book: books[isbn] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ book: books[isbn] });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports = {
  authenticated: regd_users,
  isValid: isValid,
  users: users,
};
