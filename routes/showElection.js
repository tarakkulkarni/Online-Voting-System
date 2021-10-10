const express = require("express");
const router = express.Router();
const db = require("../connection");

let ret = [];

router.get("", (req, res) => {
  const sql = `Select * from election where election_status = 0`;
  db.query(sql, (e, result) => {
    if (e) throw e;
    for (let i of result) {
      ret.push(i);
    }
  });

  setTimeout(() => {
    if (ret.length != 0) {
      res.render("showElection", { election: ret });
    } else {
      res.send("<h1> No Elections RN</h1>");
    }
    ret = [];
  }, 200);
});

module.exports = router;
