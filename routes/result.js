const express = require("express");
const router = express.Router();
const db = require("../connection");

let ret2 = [];

router.get("", (req, res) => {
  const sql2 = `select
                distinct c.election_name,can_class, candidate_name, votes
                from results r 
                inner join candidates c using(candidate_id)
                where c.election_id in (select election_id from election where election_status = 1)
                order by can_class, votes DESC;`;
  db.query(sql2, (e, result) => {
    if (e) throw e;
    for (let i of result) {
      ret2.push(i);
    }
  });
  setTimeout(() => {
    if (ret2.length !== 0) {
      res.render("result", { results: ret2 });
    } else {
      res.send("<h1>Elections are still going on</h1>");
    }
    ret2 = [];
  }, 200);
});

module.exports = router;
