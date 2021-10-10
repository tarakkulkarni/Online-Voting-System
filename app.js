const express = require("express");
const ejs = require("ejs");
const db = require("./connection");
require("dotenv").config();

//middleware
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //instead of using bodyParser
app.use(express.json());

const home = require("./routes/home");
app.use("/home", home);

//user tasks
const userlogin = require("./routes/userlogin");
app.use("", userlogin);

// const candidateApplication = require("./routes/candidateApplication");
// app.use("/candidateApplication", candidateApplication);

// const vote = require("./routes/vote");
// app.use("/vote", vote);

//admin tasks
const admin = require("./routes/admin");
app.use("/admin", admin);

const register = require("./routes/register");
app.use("/register", register);

const createElection = require("./routes/createElection");
app.use("/createElection", createElection);

const endElection = require("./routes/endElection");
app.use("/endElection", endElection);

//both
const showElection = require("./routes/showElection");
app.use("/showElection", showElection);

const result = require("./routes/result");
app.use("/result", result);

//server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
