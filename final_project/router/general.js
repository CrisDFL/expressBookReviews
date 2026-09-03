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
public_users.get('/', function (req, res) {
   const getBooks = new Promise((resolve, reject) => {
        if(books){
            resolve(books);
        } else {
            reject("Error fetching books");
        }
   });

   getBooks
        .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
        .catch(err => res.status(500).json({ message: err }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    const getIsbn = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Error fetching books");
        }
    });

    getIsbn
        .then(isbnList => res.status(200).json(isbnList))
        .catch(err => res.status(404).json({ message: err }));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const getAuthor = new Promise((resolve, reject) => {
      const newBooks = [];
      for(let isbn in books){
            if(books[isbn].author.toLocaleLowerCase() === author.toLocaleLowerCase()){
                newBooks.push({isbn: isbn, ...books[isbn]});
            } 
        }
        if (newBooks.length > 0) {
            resolve(newBooks);
        } else {
            reject("Error fetching books");
        }
    });
      
    getAuthor
        .then(authorList => res.status(200).json(authorList))
        .catch(err => res.status(404).json({ message: err }));

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const getTitle = new Promise((resolve, reject) => {
        const newBooks = [];
        for(let isbn in books){
            if(books[isbn].title.toLocaleLowerCase() === title.toLocaleLowerCase()){
                newBooks.push({isbn: isbn, ...books[isbn]});
            }
        }
        if (newBooks.length > 0) {
            resolve(newBooks);
        } else {
            reject("Error fetching books");
        }
    });

    getTitle
        .then(titleList => res.status(200).json(titleList))
        .catch(err => res.status(404).json({ message: err }));
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
