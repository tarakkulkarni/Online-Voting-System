const express = require("express");
const router = express.Router();
const db = require("../connection");

router.get("", (req, res) => {
  const data = [];
  const sql = `Select * from user where user_id like "${loginfo.id}"`;
  db.query(sql, (e, result) => {
    if (e) res.redirect("/");
    for (let i of result) {
      data.push(i);
    }
    res.render("candidateApplication", { election: data });
  });
});

router.post("", (req, res) => {
  if (req.body.class === loginfo.class) {
    const sqlcan = `Insert into candidates values("${"C".concat(
      loginfo.id
    )}", "${req.body.elename}","${req.body.eleid}","${req.body.can_name}","${
      req.body.class
    }")`;
    db.query(sqlcan, (e, result) => {
      if (e) throw e;
      res.redirect("/home");
    });
  } else {
    res.send("<h1>You can only apply for the election for your own class</h1>");
  }
});

module.exports = router;
