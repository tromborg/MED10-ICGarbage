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

module.exports = {createUser, testConn}


