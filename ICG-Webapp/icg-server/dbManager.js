const {Client} = require('pg');
const settings = require('./settings').settings;
const { v4: uuidv4 } = require('uuid');

async function createUser(usrname, mail, psswrd) {     
    try {
        
        const client = new Client({
            user: settings.pgInfo.user,
            host: settings.pgInfo.host,
            database: settings.pgInfo.database,
            password: settings.pgInfo.password,
            port: settings.pgInfo.port,
        });
 
        console.log(`Creating user, usr: ${usrname}, mail: ${mail}, psswrd: ${psswrd}`);
        const query = {
            text: 'INSERT INTO users(username, email, password, points) VALUES($1, $2, $3, $4)',
            values: [usrname, mail, psswrd, 0],
          };
        await client.connect()
        await client.query(query);
        await client.end();
    } catch (error) {
            console.error('Error inserting user:', error);
        throw error;
    }
}

async function checkLogin(usrname, psswrd) {
    const dbInfo = {
        user: settings.pgInfo.user,
        host: settings.pgInfo.host,
        database: settings.pgInfo.database,
        password: settings.pgInfo.password,
        port: settings.pgInfo.port,
    }
    const client = new Client(dbInfo);

    try {
        await client.connect();

        const queryText = 'SELECT password FROM users WHERE username = $1';
        const result = await client.query(queryText, [usrname]);

        if (result.rows.length === 0) {
            console.log("Cant find user");
            return false; // User does not exist
        }
  
        const storedPassword = result.rows[0].password;

        const useridQuery = 'SELECT userid FROM users WHERE username = $1';
        const resultId = await client.query(useridQuery, [usrname]);
        const userid = resultId.rows[0].userid;
        let loginInstance = {"userid":`${userid}`, "isLoggedIn": psswrd === storedPassword}
        return loginInstance;
    } catch (error) {
        console.error('Error checking user and password:', error);
        return {"userId":`none`, "isLoggedIn": false};

    } finally {
        
        await client.end();
    }
}

async function getUser(user_id){
    const dbInfo = {
        user: settings.pgInfo.user,
        host: settings.pgInfo.host,
        database: settings.pgInfo.database,
        password: settings.pgInfo.password,
        port: settings.pgInfo.port,
    }
    const client = new Client(dbInfo);

    try {
        await client.connect();

        const queryText = 'SELECT * FROM users WHERE userid = $1';
        const result = await client.query(queryText, [user_id]);

        if (result.rows.length === 0) {
            console.log("Cant find user");
            return false; // User does not exist
        }
  
        const userData = result.rows.map(row => ({
            userid: row.userid,
            username: row.username,
            email: row.email,
            signupdate: row.signup_date,
            points: row.points,
            total_points: row.total_points
          }));

        const userOverview = {...userData[0]}

        return userOverview;
    } catch (error) {
        console.error('Error checking user and password:', error);
        return {"userId":`none`, "isLoggedIn": false};

    } finally {
        
        await client.end();
    }
}

async function getTimeSeriesData(userid){
    const dbInfo = {
        user: settings.pgInfo.user,
        host: settings.pgInfo.host,
        database: settings.pgInfo.database,
        password: settings.pgInfo.password,
        port: settings.pgInfo.port,
    }
    const client = new Client(dbInfo);

    try {
        await client.connect();

        const queryText = 'SELECT * FROM videodata WHERE userid = $1;';
        const results = await client.query(queryText, [userid]);

        if (results.rows.length === 0) {
            console.log("Cant find users");
            throw new Error("Cant find any users")
        }
        
        console.log("results length: " + results.rows.length);
        const timeData = results.rows.map(row => ({
            userId: row.userid,
            points: row.points,
            timeStamp: row.upload_date,
            currentPoints: row.current_points
          }));
        
        
        console.log("timeData: " + timeData);
        return timeData

    } catch (e){
        console.log("Error in getUserStats: " + e);

    } finally {
        await client.end();
    }
}


async function getScoreboardData(){
    const dbInfo = {
        user: settings.pgInfo.user,
        host: settings.pgInfo.host,
        database: settings.pgInfo.database,
        password: settings.pgInfo.password,
        port: settings.pgInfo.port,
    }
    const client = new Client(dbInfo);

    try {
        await client.connect();

        const queryText = 'SELECT "username", "userid", "total_points" FROM users;';
        const result = await client.query(queryText);

        if (result.rows.length === 0) {
            console.log("Cant find users");
            throw new Error("Cant find any users")
        }

        const userList = result.rows.map(row => ({
            userid: row.userid,
            user: row.username,
            points: row.total_points
          }));
        

        console.log("userlist: " + JSON.stringify(userList));
        return userList

    } catch (e){
        console.log("Error in getScoreboardData: " + e);

    } finally {
        await client.end();
    }
}

async function getPurchaseData(userid){
    const dbInfo = {
        user: settings.pgInfo.user,
        host: settings.pgInfo.host,
        database: settings.pgInfo.database,
        password: settings.pgInfo.password,
        port: settings.pgInfo.port,
    }
    const client = new Client(dbInfo);

    try {
        await client.connect();

        const queryText = 'SELECT "userid", "coupon_id", "purchase_date" FROM purchases WHERE userid = $1;';
        const result = await client.query(queryText, [userid]);

        if (result.rows.length === 0) {
            console.log("Cant find users");
            throw new Error("Cant find any users")
        }

        const purchaseList = result.rows.map(row => ({
            userid: row.userid,
            couponid: row.coupon_id,
            purchase_date: row.purchase_date
          }));
        

        console.log("userlist: " + JSON.stringify(purchaseList));
        return purchaseList

    } catch (e){
        console.log("Error in getPurchaseData: " + e);

    } finally {
        await client.end();
    }
}

async function insertPurchase(userid, purchaseid) {     
    try {
        
        const client = new Client({
            user: settings.pgInfo.user,
            host: settings.pgInfo.host,
            database: settings.pgInfo.database,
            password: settings.pgInfo.password,
            port: settings.pgInfo.port,
        });
 
        console.log(`inserting purchase, usr: ${userid}, purchaseid: ${purchaseid}`);
        const query = {
            text: 'INSERT INTO purchases(userid, coupon_id) VALUES($1, $2)',
            values: [userid, purchaseid],
          };
        await client.connect()
        await client.query(query);
        await client.end();
    } catch (error) {
            console.error('Error inserting purchase:', error);
        throw error;
    }
}

async function testConn(){
    console.error('Testing database connection');
       
    const client = new Client({
        user: settings.pgInfo.user,
        host: settings.pgInfo.host,
        database: settings.pgInfo.database,
        password: settings.pgInfo.password,
        port: settings.pgInfo.port,
    })
    
    await client.connect()
    
    console.log(await client.query('SELECT * FROM users'))
    
    await client.end()
}

async function updatePoints(userid, points, isSubtract){
    const dbInfo = {
        user: settings.pgInfo.user,
        host: settings.pgInfo.host,
        database: settings.pgInfo.database,
        password: settings.pgInfo.password,
        port: settings.pgInfo.port,
    }
    const client = new Client(dbInfo);

    try {
        await client.connect();

        const queryText = 'SELECT points FROM users WHERE userid = $1;';
        const results = await client.query(queryText, [userid]);


        if (results.rows.length === 0) {
            console.log("Cant find users");
            throw new Error("Cant find any users")
        }
        const currentPoints = results.rows[0].points;
        let newPoints = currentPoints;
        if(isSubtract === true){
            newPoints = currentPoints - points;
        }
        if(isSubtract === false){
            newPoints = currentPoints + points;
        }
        const updateQueryText = 'UPDATE users SET points = $1 WHERE userid = $2';
        const updateResults = await client.query(updateQueryText, [newPoints, userid]);

    } catch (e){
        console.log("Error in updatePoints: " + e);

    } finally {
        await client.end();
    }
}

module.exports = {createUser, testConn, checkLogin, getScoreboardData, getTimeSeriesData, updatePoints, getUser, getPurchaseData, insertPurchase}


