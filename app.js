const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");
require("dotenv").config();

///////////////////////////////////////////////////////////////////////////
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tar#mysqlDB@1810",
  database: "Online_Voting",
});

db.connect((e) => {
  if (e) {
    throw e;
  }
  console.log("Connected");
});
///////////////////////////////////////////////////////////////////////////
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //instead of using bodyParser
app.use(express.json());
///////////////////////////////////////////////////////////////////////////
// app.route("/trial")
// .get((req,res) => {
//     db.query(
//         'SELECT* FROM `course`',
//         (e, result) => {
//             if(e) throw e;
//             res.sendFile(result);
//         }
//     );
// });

var loginfo = {
  id: String,
  class: String,
};

app.route("/home").get((req, res) => {
  res.render("home");
});

///////////////////////////////////////////////////////////////////////////
app
  .route("/")

  .get((req, res) => {
    res.sendFile(__dirname + "/views/login.html");
  })

  .post((req, res) => {
    var ret = [];
    const id = req.body.username;
    const password = req.body.password;
    const sql = `Select user_id, user_password, user_class, year FROM user WHERE user_id = "${req.body.username}" AND user_password = "${req.body.password}"`;
    db.query(sql, (e, result) => {
      if (e) throw e;
      // console.log(result);
      for (var i of result) {
        ret.push(i);
      }

      if (ret.length === 0) {
        res.send("<h1>Username and Password do not match</h1>");
      } else {
        loginfo.id = id;
        loginfo.class = ret[0].user_class;
        if (id.startsWith("A")) {
          res.redirect("/admin");
          return;
        } else if (id.startsWith("C")) {
          res.redirect("/candidate");
          return;
        }
        res.redirect("/home");
      }

      // console.log(req.body.username, req.body.password);
      //     console.log(parseInt(ret[0].id), ret[0].password);

      // if(req.body.username === ret[0].id.toString() && req.body.password === ret[0].password){

      //     res.redirect("/home");
      // }
    });
  });
////////////////////////////////////////////////////////////////////////////
app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    const id = req.body.id;
    const sql = `Insert into user (user_id, user_name, age, user_password, user_class, year) values("${req.body.id}", "${req.body.name}", ${req.body.age}, "${req.body.password}", "${req.body.class}", ${req.body.year})`;
    db.query(sql, (e, result) => {
      if (e) throw e;
      loginfo.id = req.body.id;
      loginfo.class = req.body.class;
    });
    if (id.startsWith("A")) {
      res.redirect("/admin");
      return;
    } else if (id.startsWith("C")) {
      res.redirect("/candidate");
      return;
    } else {
      res.redirect("/home");
    }
  });
/////////////////////////////////////////////////////////////////////////////
app
  .route("/admin")

  .get((req, res) => {
    res.render("admin");
  });
/////////////////////////////////////////////////////////////////////////////
app
  .route("/createElection")

  .get((req, res) => {
    res.render("createElection");
  })

  .post((req, res) => {
    var ret = [];
    const id = req.body.username;
    const password = req.body.password;
    // const sql = `Select id,password FROM user WHERE id = ${req.body.username} AND password = "${req.body.password}"`
    const sql = `Insert into election (election_id, election_name, election_class, year)
                 values("${req.body.election_id}", "${req.body.election_name}","${req.body.election_class}", ${req.body.year})`;
    db.query(sql, (e, result) => {
      if (e) throw e;
      // console.log(result);
      res.redirect("/admin");
      // for(var i of result){
      //     ret.push(i);
      // }
      // if(ret.length === 0){
      //     console.log("Username and Password do not match");
      // } else {
      //     res.redirect("/home");
      // }
    });
  });
/////////////////////////////////////////////////////////////////////////////
app
  .route("/candidateApplication")

  .get((req, res) => {
    const data = [];
    const sql = `Select * from user where user_id like "${loginfo.id}"`;
    db.query(sql, (e, result) => {
      if (e) throw e;
      for (var i of result) {
        data.push(i);
      }
      res.render("candidateApplication", { election: data });
    });
  })

  .post((req, res) => {
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
      const sqlres = `Insert into results values ("${
        req.body.eleid
      }","${"C".concat(loginfo.id)}",0)`;
      db.query(sqlres, (e, result) => {
        if (e) throw e;
      });
    } else {
      res.send(
        "<h1>You can only apply for the election for your own class</h1>"
      );
    }
  });
/////////////////////////////////////////////////////////////////////////////
// app.route("/showElection")
const ret = [];
const sql = `Select * from election where election_status = 0`;
db.query(sql, (e, result) => {
  if (e) throw e;
  for (var i of result) {
    ret.push(i);
  }
});

app.get("/showElection", (req, res) => {
  res.render("showElection", { election: ret });
});

// app.get("/result",(req,res)=>{
//   res.render("result");
// })
/////////////////////////////////////////////////////////////////////////////
// app.route("/vote")
const ret1 = [];
const sql1 = `select * from candidates where election_id in (select election_id from election where election_status = 0)`;
db.query(sql1, (e, result) => {
  if (e) throw e;
  for (var i of result) {
    ret1.push(i);
  }
});

app.get("/vote", (req, res) => {
  res.render("vote", { candidates: ret1 });
});

app.post("/vote", (req, res) => {
  if (loginfo.class === req.body.class) {
    const sql = `call updatevotecount(${req.body.eleid},'${req.body.canid}')`;
    db.query(sql, (e, result) => {
      if (e) throw e;
      res.redirect("/home");
    });
  } else {
    res.send("<h1> You cannot vote for another class </h1>");
  }
});
/////////////////////////////////////////////////////////////////////////////
app
  .route("/endElection")

  .get((req, res) => {
    res.render("endElection");
  })

  .post((req, res) => {
    const sql = `Update election set election_status = 1 where election_id = "${req.body.eleid}"`;
    db.query(sql, (e, result) => {
      if (e) throw e;
      res.redirect("/admin");
    });
  });
/////////////////////////////////////////////////////////////////////////////
const ret2 = [];
// const sql2 = `select * from results where election_id in (select election_id from election where election_status = 1) `
const sql2 = `select
                distinct c.election_name, candidate_name, votes
                from results r
                inner join candidates c using(candidate_id)
                where c.election_id in (select election_id from election where election_status = 1)
                order by votes DESC;`;
db.query(sql2, (e, result) => {
  if (e) throw e;
  for (var i of result) {
    ret2.push(i);
  }
});

app.get("/result", (req, res) => {
  res.render("result", { results: ret2 });
});

// app.post("/result",(req,res) => {
// // if( loginfo.class === req.body.class){
//     const sql = `call updatevotecount(${req.body.eleid},"${req.body.canid}")`
//     db.query(sql,(e,result) => {
//         if(e) throw e;
//         res.redirect("/home");
//     })
// // } else {
// //     res.send("<h1> You cannot vote for another class </h1>");
// //}
// });

/////////////////////////////////////////////////////////////////////////////
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
