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
  console.log("usercheck: " + user);
  let loginInstance = {"userId":"410a2388-804e-44c2-983b-470c6e5e1277", "isLoggedIn": user}
  res.status(200).send(loginInstance);
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
