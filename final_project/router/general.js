const express = require('express');
const public_users = express.Router();
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

// Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// ✅ Get all books (async/await)
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// ✅ Get book by ISBN (async/await)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const book = books[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});

// ✅ Get books by author
public_users.get('/author/:author', async (req, res) => {
  try {
    const filtered = Object.values(books).filter(
      b => b.author.toLowerCase() === req.params.author.toLowerCase()
    );

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(filtered);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// ✅ Get books by title
public_users.get('/title/:title', async (req, res) => {
  try {
    const filtered = Object.values(books).filter(
      b => b.title.toLowerCase() === req.params.title.toLowerCase()
    );

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(filtered);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// ✅ Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const book = books[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book.reviews);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving reviews" });
  }
});

module.exports.general = public_users;