var CONF = require('./conf');
const { Client } = require('pg');

const client = new Client({
  user: CONF.DB.USER,
  password: CONF.DB.PASSWORD,
  database: CONF.DB.DATABASE,
  host: CONF.DB.HOST,
  port: CONF.DB.PORT
})

client.connect((err) => {
  if (err) {
    console.log(`connecting failed to db server`);
    //process.exit(1);
  }
  console.log(`connecting succeed to db server`);
})

module.exports = {
  client: client,
}