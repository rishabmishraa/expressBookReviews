const express = require('express');
const axios = require('axios');
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
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 1: Get all books – async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/all-books');
    res.send(response.data);
  } catch (error) {
    res.send(JSON.stringify(books, null, 4));
  }
});

// Task 2: Get book by ISBN – Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject({ status: 404, message: "Book not found" });
  })
    .then(book => res.send(book))
    .catch(err => res.status(err.status).json({ message: err.message }));
});

// Task 2: Get book by ISBN – async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    res.send(response.data);
  } catch (error) {
    new Promise((resolve, reject) => {
      const book = books[req.params.isbn];
      if (book) resolve(book);
      else reject({ status: 404, message: "Book not found" });
    })
      .then(book => res.send(book))
      .catch(err => res.status(err.status).json({ message: err.message }));
  }
});

// Task 3: Get books by author – async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const matchingBooks = Object.values(books).filter(
      b => b.author.toLowerCase() === req.params.author.toLowerCase()
    );
    if (matchingBooks.length === 0)
      return res.status(404).json({ message: "No books found for this author" });
    res.send(matchingBooks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 4: Get books by title – async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const matchingBooks = Object.values(books).filter(
      b => b.title.toLowerCase() === req.params.title.toLowerCase()
    );
    if (matchingBooks.length === 0)
      return res.status(404).json({ message: "No books found with this title" });
    res.send(matchingBooks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.send(book.reviews);
});

module.exports.general = public_users;