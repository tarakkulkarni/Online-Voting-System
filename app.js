const express = require('express');
const mysql = require('mysql2');
const ejs = require("ejs");
require('dotenv').config();

///////////////////////////////////////////////////////////////////////////
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: process.env.PASSWORD,
    database:'university'
});

db.connect((e) => {
    if(e){
        throw e;
    } 
    console.log("Connected");
    
});
///////////////////////////////////////////////////////////////////////////
db.query(
    'SELECT* FROM `course`',
    (e, result) => {
        if(e) throw e;
        console.log(result);
    }
);
///////////////////////////////////////////////////////////////////////////

const app = express();
app.set('view engine','ejs');
app.use(express.static("public"));
///////////////////////////////////////////////////////////////////////////
app.route("/")

.get((req,res) =>{
    res.sendFile(__dirname+"/views/login.html");
});
////////////////////////////////////////////////////////////////////////////
app.route("/register")

.get((req,res) =>{
    res.render("register");
});
/////////////////////////////////////////////////////////////////////////////
app.listen(3000, () => {
    console.log("Server started on port 3000");
});