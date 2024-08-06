const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.engine('.html', require("ejs").__express);
app.set('views', __dirname + "/views");
app.set('view engine', 'html');
//app.use('/static', express.static(path.join(__dirname + "./public")));
app.use(express.static("public"));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', ['POST', 'GET', 'PUT']);
  return next();
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  console.log("server is running")
  res.render("index.html")
})

require(__dirname + "/router")(app);
app.listen(9997, function (res) {
  console.log("server is running")
})