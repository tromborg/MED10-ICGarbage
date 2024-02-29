const express = require('express');
const app = express();
const cors = require('cors');
const dbManager = require('./dbManager');
var bodyParser = require('body-parser')
app.use(cors())
PORT = 3010;


var jsonParser = bodyParser.json();

app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
}) 

app.post('/api/registeruser', jsonParser, async (req, res) => {
    console.log("registeruser called");
    console.log("req: " +  req.body);
    console.log("json: " + JSON.stringify(req.body));
    let userBody = JSON.parse(JSON.stringify(req.body));
    console.log("reqbody: " + userBody.email);
    await dbManager.createUser(userBody.userName, userBody.email, userBody.password);
    res.sendStatus(200);
});

app.get('/test', async (req, res) => {
    console.log('/test request recevied');
    await dbManager.testConn();
    res.send('Test complete');
});

app.get('/healthz', async (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).send("{\"status\": \"healthy\"}");
});
