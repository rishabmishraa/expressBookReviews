const express = require('express');
const axios = require('axios');
const public_users = express.Router();
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

// ================= REGISTER =================
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
  return res.status(201).json({
    message: "User successfully registered. Now you can login"
  });
});

// ================= GET ALL BOOKS (Axios + async) =================
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(200).json(books);
  }
});

// ================= GET BOOK BY ISBN =================
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    const book = books[req.params.isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  }
});

// ================= GET BOOKS BY AUTHOR =================
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    return res.status(200).json(response.data);
  } catch (err) {
    const filtered = Object.values(books).filter(
      b => b.author.toLowerCase() === req.params.author.toLowerCase()
    );

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(filtered);
  }
});

// ================= GET BOOKS BY TITLE =================
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${req.params.title}`
    );
    return res.status(200).json(response.data);
  } catch (err) {
    const filtered = Object.values(books).filter(
      b => b.title.toLowerCase() === req.params.title.toLowerCase()
    );

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(filtered);
  }
});

// ================= GET BOOK REVIEW =================
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res.json({ message: "No reviews found for this book." });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;