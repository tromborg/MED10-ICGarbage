const express = require("express");
const app = express();
const cors = require("cors");
const dbManager = require("./dbManager");
var bodyParser = require("body-parser");
app.use(cors());
PORT = 3010;

var jsonParser = bodyParser.json();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

app.post("/api/registeruser", jsonParser, async (req, res) => {
  console.log("registeruser called");
  console.log("req: " + req.body);
  console.log("json: " + JSON.stringify(req.body));
  let userBody = JSON.parse(JSON.stringify(req.body));
  console.log("reqbody: " + userBody.email);
  await dbManager.createUser(
    userBody.userName,
    userBody.email,
    userBody.password
  );
  res.sendStatus(200);
});

app.post("/api/checklogin", jsonParser, async (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  console.log("reqbody: " + body.userName);
  let user = await dbManager.checkLogin(body.userName, body.password);
  console.log("usercheck: " + user.userId);
  console.log("isloggedin: " + user.isLoggedIn);
  res.status(200).send(user);
});

app.post("/api/getuser", jsonParser, async (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  console.log("getuser called from: " + body.userid);
  let user = await dbManager.getUser(body.userid);
  res.status(200).send(user);
});

app.get("/test", async (req, res) => {
  console.log("/test request recevied");
  await dbManager.testConn();
  res.send("Test complete");
});

app.get("/healthz", async (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send('{"status": "healthy"}');
});

app.get("/api/getscoreboardinfo", async (req, res) => {
  let scoreBoardData = await dbManager.getScoreboardData();
  res.status(200).send(scoreBoardData);
});

app.post("/api/gettimeseriesdata", jsonParser, async (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  console.log("id: " + body);
  console.log("id1: " + JSON.stringify(body));
  console.log("id2: " + JSON.stringify(req.body));
  let timeSeriesData = await dbManager.getTimeSeriesData(body.userid);
  console.log("id3: " + JSON.stringify(timeSeriesData));
  res.status(200).send(timeSeriesData);
});

app.post("/api/updatepoints", jsonParser, async (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  await dbManager.updatePoints(body.userid, body.points, body.isSubtract);
  res.sendStatus(200);
});

app.post("/api/createpurchase", jsonParser, async (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  await dbManager.insertPurchase(body.userid, body.coupon_id);
  res.sendStatus(200);
});

app.post("/api/getpurchases", jsonParser, async (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  let purchases = await dbManager.getPurchaseData(body.userid);
  res.status(200).send(purchases);
});



