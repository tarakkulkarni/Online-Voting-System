const express = require("express");
const router = express.Router();
const db = require("../connection");

router.get("", (req, res) => {
  res.render("endElection");
});

router.post("", (req, res) => {
  const sql = `Update election set election_status = 1 where election_id = "${req.body.eleid}"`;
  db.query(sql, (e, result) => {
    if (e) throw e;
    res.redirect("/admin");
  });
});

module.exports = router;
