const express = require("express");
const bodyParser = require("body-parser");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");
const askValid = require("./validation/ask");

const adapter = new FileSync("db.json");
const db = lowdb(adapter);
db.defaults({ asks: [] }).write();

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const asks = db.get("asks").value();
  const ask = asks[Math.floor(Math.random() * asks.length)];
  res.render("index", {
    ask: ask,
  });
});

app.get("/ask", (req, res) => {
  res.render("ask");
});

app.get("/result/:askId", (req, res) => {
  const ask = db.get("asks").find({ id: req.params.askId }).value();
  res.render("result", {
    ask: ask,
  });
});

app.post("/ask", askValid.valid, (req, res) => {
  db.get("asks")
    .push({ id: shortid.generate(), ask: req.body.ask, yes: 0, no: 0 })
    .write();
  res.redirect("/");
});

app.post("/ask/:askId", (req, res) => {
  const ask = db.get("asks").find({ id: req.params.askId }).value();
  const askIndex = db.get("asks").value().indexOf(ask);

  if (req.body.yes) db.set(`asks[${askIndex}].yes`, ask.yes + 1).write();
  else db.set(`asks[${askIndex}].no`, ask.no + 1).write();
  const askU = db.get("asks").value()[askIndex];
  res.render("result", {
    ask: askU,
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
