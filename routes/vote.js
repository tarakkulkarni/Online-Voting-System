const express = require("express");
const router = express.Router();
const db = require("../connection");

let ret1 = [];

router.get("", (req, res) => {
  const sql1 = `select * from candidates where election_id in (select election_id from election where election_status = 0)`;
  db.query(sql1, (e, result) => {
    if (e) throw e;
    for (let i of result) {
      ret1.push(i);
    }
  });
  setTimeout(() => {
    res.render("vote", { candidates: ret1 });
    ret1 = [];
  }, 200);
});

router.post("", (req, res) => {
  const sql3 = `select * from voted where user_id = "${loginfo.id}" and election_id = "${req.body.eleid}"`;
  db.query(sql3, (e, result) => {
    if (e) throw e;
    for (let i of result) {
      ret1.push(i);
    }
  });
  setTimeout(() => {
    console.log(ret1);
    if (ret1.length !== 0) {
      res.send("<h1>Dont multi vote ;)</h1>");
      return;
    }
  }, 200);

  if (loginfo.class === req.body.class) {
    const sql1 = `insert into voted values ("${loginfo.id}","${req.body.eleid}");`;
    db.query(sql1, (e, result) => {
      if (e) throw e;
    });

    const sql = `call updatevotecount(${req.body.eleid},'${req.body.canid}')`;
    db.query(sql, (e, result) => {
      if (e) throw e;
      res.redirect("/home");
    });
  } else {
    res.send("<h1> You cannot vote for another class </h1>");
  }
});

module.exports = router;
