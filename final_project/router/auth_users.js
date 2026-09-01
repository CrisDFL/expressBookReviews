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

app.post('/register', (req, res) => {
    let {username, password} = req.body;

    if(username && password){
        if(!isValid){
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
     return res.status(404).json({message: "Unable to register user."});
});


//only registered users can login
regd_users.post("/login", (req,res) => {

    let { username, password } = req.body;

    if(authenticatedUser(username, password)) {
        let token = jwt.sign(
            {data: password},
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
