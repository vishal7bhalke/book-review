const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Validate the username and password format (you can use your own validation logic)
  if (!isValid(username, password)) {
    return res.status(400).json({ message: "Invalid username or password format." });
  }

  // Create a new user object and add it to the users array (simulating registration)
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully.", user: newUser });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json({ book });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = books.filter(book => book.author === author);

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "Books by this author not found." });
  }

  return res.status(200).json({ books: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksWithTitle = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (booksWithTitle.length === 0) {
    return res.status(404).json({ message: "Books with this title not found." });
  }

  return res.status(200).json({ books: booksWithTitle });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === isbn);

  if (!book || !book.reviews || book.reviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for this book." });
  }

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
