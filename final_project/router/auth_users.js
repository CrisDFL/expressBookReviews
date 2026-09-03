const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validateUsername = users.filter(user => user.username === username);

    if(validateUsername.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validateAuth = users.filter(user => user.username === username && user.password === password);

    if(validateAuth.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    let { username, password } = req.body;

    if(authenticatedUser(username, password)) {
        let token = jwt.sign(
            {username: username},
            'access',
            {expiresIn: 60 * 60}
        );

        req.session.authenticated = {
            token, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (!req.session || !req.session.authenticated) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.session.authenticated.username;
    const review = req.body.review || req.body.reviews;

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }
    book.reviews[username] = review;

    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (!req.session || !req.session.authenticated) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.session.authenticated.username;

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if(book.reviews && book.reviews[username]){
        delete book.reviews[username]; 
        return res.status(200).json({ 
            message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted.` 
        });
    } else {
        return res.status(404).json({ 
            message: "No review found for this user on this book" 
        });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
