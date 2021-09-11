const express = require('express');
const ejs = require("ejs");


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