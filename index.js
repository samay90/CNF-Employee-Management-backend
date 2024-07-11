const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mysql");
const app = express();
const verify = require("./Secure/verifier.js");

const db = sql.createPool({
  user: "sqluser",
  password: "password",
  database: "cmf",
  host: "localhost",
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(1920);

app.get("/", (req, res) => {
  res.send("Welcome to CMF");
});
app.get("/data", async (req, res) => {
  const key = await req.query.key;
  if (verify(key)) {
    const q = "select * from employee order by id;";
    db.query(q, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send("Sorry");
  }
});
app.get("/data/:id", async (req, res) => {
  const key = await req.query.key;
  const id = await req.params.id;
  if (verify(key)) {
    const q = `select * from employee where id=${id};`;
    db.query(q, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result[0]);
      }
    });
  } else {
    res.send("Sorry");
  }
});
app.delete("/del/:id", async (req, res) => {
  const key = await req.query.key;
  const id = await req.params.id;
  if (verify(key)) {
    const q = `delete from employee where id=${id}`;
    db.query(q, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send("Sorry");
  }
});
app.post("/add/emp", async (req, res) => {
  const key = await req.query.key;
  if (verify(key)) {
    const name = await req.body.name;
    const avatar = await req.body.avatar;
    const job = await req.body.job;
    const city = await req.body.city;
    const language = await req.body.language;
    const email = await req.body.email;
    const phone = await req.body.phone;
    const ip_address = await req.body.ip_address;
    const salary = await req.body.salary;
    const address = await req.body.address;
    const id = await req.body.id;
    const q =
      await `insert into employee (id,name,avatar,job,city,language,email,phone,ip_address,salary,address) values (${id},'${name}','${avatar}','${job}','${city}','${language}','${email}','${phone}','${ip_address}','${salary}','${address}');`;
    db.query(q, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send("Sorry");
  }
});

app.post("/edit/:id", async (req, res) => {
  const key = await req.query.key;
  const id = await req.params.id;
  if (verify(key)) {
    const name = await req.body.name;
    const avatar = await req.body.avatar;
    const job = await req.body.job;
    const city = await req.body.city;
    const language = await req.body.language;
    const email = await req.body.email;
    const phone = await req.body.phone;
    const ip_address = await req.body.ip_address;
    const salary = await req.body.salary;
    const address = await req.body.address;
    const q =
      await `update employee set name='${name}' , salary='${salary}',avatar='${address}', email='${email}',city='${city}',ip_address='${ip_address}',salary='${salary}',address='${address}',phone='${phone}',language='${language}',job='${job}',avatar='${avatar}' where id=${id};`;
    db.query(q, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send("Sorry");
  }
});

app.get("/getCurrentId", (req, res) => {
  const key = req.query.key;
  if (verify(key)) {
    const q = "Select max(id) as empN from employee";
    db.query(q, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result[0]);
      }
    });
  }
});
app.get("/getIds", (req, res) => {
  const key = req.query.key;
  if (verify(key)) {
    const q = "Select id from employee";
    db.query(q, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        var l = [];
        for (let i = 0; i < result.length; i++) {
          l.push(result[i].id);
        }
        res.send(l);
      }
    });
  }
});
app.get("/data/page/:page", (req, res) => {
  const key = req.query.key;
  if (verify(key)) {
    const page = parseInt(req.params.page);
    const q = `select * from employee order by id limit 10 offset ${
      (page - 1) * 10
    };`;
    db.query(q, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  } else {
    res.send("Sorry");
  }
});

app.get("/panelInfo",(req,res)=>{
  const key = req.query.key;
  if (verify(key)){
    const q1 = 'select count(id) as totalEmp from employee;'
    const q2= 'select job,count(job) as totalEmp from employee group by job'
    let data = {}
    db.query(q1, (err,result)=>{
      if (err){
        console.log(err);
      }else{
        data.totalEmp = result[0].totalEmp
        }
    })
    db.query(q2, (err,result)=>{
      if (err){
        console.log(err);
      }else{
        const list =result.sort((a,b)=>{return b.totalEmp-a.totalEmp})
        data.category = list;
      res.send(data)
        }
    })
  }
})





