const express = require("express");
const router = express.Router();
const db = require("../connection");

router.get("", (req, res) => {
  res.render("register");
});

router.post("", (req, res) => {
  const sql = `Insert into user (user_id, user_name, age, user_password, user_class, year) values("${req.body.id}", "${req.body.name}", ${req.body.age}, "${req.body.password}", "${req.body.class}", ${req.body.year})`;
  db.query(sql, (e, result) => {
    if (e) throw e;
  });
  res.redirect("/admin");
});

module.exports = router;
