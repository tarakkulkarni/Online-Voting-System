const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../connection");

let loginfo = {
  id: String,
  class: String,
};

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

router.post("/", (req, res) => {
  let ret = [];
  const id = req.body.username;
  const password = req.body.password;
  const sql = `Select user_id, user_password, user_class, year FROM user WHERE user_id = "${id}" AND user_password = "${password}"`;
  db.query(sql, (e, result) => {
    if (e) throw e;
    for (let i of result) {
      ret.push(i);
    }
  });
  setTimeout(() => {
    loginfo.id = ret[0].user_id;
    loginfo.class = ret[0].user_class;

    if (ret.length === 0) {
      res.send("<h1>Username and Password do not match</h1>");
    } else {
      if (id.startsWith("A")) {
        res.redirect("/admin");
        return;
      } else if (id.startsWith("C")) {
        res.redirect("/candidate");
        return;
      }
      res.redirect("/home");
    }
  }, 200);
});

//candidateApplication
router.get("/candidateApplication", (req, res) => {
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

router.post("/candidateApplication", (req, res) => {
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

//vote
let ret1 = [];

router.get("/vote", (req, res) => {
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

router.post("/vote", (req, res) => {
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
