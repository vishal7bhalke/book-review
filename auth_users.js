const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Write code to check if the username is valid (e.g., length requirements, special characters, etc.)
    // For example, assuming a minimum length of 6 characters:
    return username.length >= 6;
};

const authenticatedUser = (username, password) => {
    // Write code to check if username and password match the ones we have in records
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username is valid
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username format." });
    }

    // Check if the user is authenticated
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ username }, "your_secret_key_here", { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review (requires authentication)
regd_users.put("/auth/review/:isbn", (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing." });
    }

    jwt.verify(token, "your_secret_key_here", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token." });
        }

        const { username } = decoded;
        const isbn = req.params.isbn;
        const book = books.find(book => book.isbn === isbn);

        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Assuming the review data is provided in the request body
        const { review } = req.body;

        // Add the review to the book object
        book.reviews.push({ username, review });

        return res.status(200).json({ message: "Review added successfully.", book });
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
