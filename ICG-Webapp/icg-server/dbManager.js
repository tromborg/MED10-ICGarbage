const {Client} = require('pg');
const settings = require('./settings').settings;


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
        console.log("usr: " + psswrd === storedPassword);
        return psswrd === storedPassword;
    } catch (error) {
        console.error('Error checking user and password:', error);
        return false;

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

module.exports = {createUser, testConn, checkLogin}


