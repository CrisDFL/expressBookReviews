const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let {username, password} = req.body;

    if(username && password){
        if(isValid){
            users.push({"username": username, "password": password});
            return res.status(201).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
     return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if(book){
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Libro no encontrado" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const newBooks = [];

  for(let isbn in books){
    if(books[isbn].author.toLocaleLowerCase() === author.toLocaleLowerCase()){
        newBooks.push({isbn: isbn, ...books[isbn]});
    }
  }
  if (newBooks.length > 0) {
    return res.status(200).json(newBooks);
  } else {
    return res.status(404).json({ message: "No se encontraron libros de este autor" });
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const newBooks = [];
  
    for(let isbn in books){
      if(books[isbn].title.toLocaleLowerCase() === title.toLocaleLowerCase()){
          newBooks.push({isbn: isbn, ...books[isbn]});
      }
    }
    if (newBooks.length > 0) {
      return res.status(200).json(newBooks);
    } else {
      return res.status(404).json({ message: "No se encontraron libros de este autor" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
  
});

module.exports.general = public_users;
