const express = require("express");
const router = express.Router();
const db = require("../connection");

router.get("", (req, res) => {
  res.render("createElection");
});

router.post("", (req, res) => {
  const sql = `Insert into election (election_id, election_name, election_class, year)
                 values("${req.body.election_id}", "${req.body.election_name}","${req.body.election_class}", ${req.body.year})`;
  db.query(sql, (e, result) => {
    if (e) throw e;
    res.redirect("/admin");
  });
});

module.exports = router;
