const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "trees123@M",
  database: "online_voting",
});

db.connect((e) => {
  if (e) {
    throw e;
  }
  console.log("CONNECTED TO DB");
});

module.exports = db;
