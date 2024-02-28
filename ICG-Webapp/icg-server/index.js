const express = require('express');
const app = express();
const cors = require('cors');
const dbManager = require('./dbManager');
const e = require('express');
app.use(cors())

PORT = "3010"
app.listen(3010, () => {
      console.log(`server listening on port ${PORT}`);
}) 

app.get('/api/registeruser', async (req, res) => {
    await dbManager.createUser(req.body.username, req.body.email, req.body.password);
    res.send('New user registered');
});

app.get('/test', async (req, res) => {
    console.log('/test request recevied');
    await dbManager.testConn();
    res.send('Test complete')
});
