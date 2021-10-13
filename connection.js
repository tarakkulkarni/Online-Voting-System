const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Zekrom0@hell",
  database: "online_voting",
});

db.connect((e) => {
  if (e) {
    throw e;
  }
  console.log("CONNECTED TO DB");
});

module.exports = db;
