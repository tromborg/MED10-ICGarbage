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
        let loginInstance = {"userId":`${userid}`, "isLoggedIn": psswrd === storedPassword}
        return loginInstance;
    } catch (error) {
        console.error('Error checking user and password:', error);
        return {"userId":`none`, "isLoggedIn": false};

    } finally {
        
        await client.end();
    }
}

async function getUserStats(user_id){
    // Get total user points from users table
    // Get all instances of uploads and their respective points and timestamps from videodata table
    // Create JS and Oject with timeseries data (totalpoint: total, points: weekly, monthly) for overview
    
}

async function getScoreboardData(){
    // Return JS Object with all usernames and their total points, all from users table
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

        const queryText = 'SELECT "username", "points" FROM users;';
        const result = await client.query(queryText);

        if (result.rows.length === 0) {
            console.log("Cant find users");
            throw new Error("Cant find any users")
        }

        const userList = result.rows.map(row => ({
            user: row.username,
            points: row.points
          }));
        

        console.log(userList);
        return userList

    } catch (e){
        console.log("Error in getUserStats: " + e);

    } finally {
        await client.end();
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

module.exports = {createUser, testConn, checkLogin, getScoreboardData}


