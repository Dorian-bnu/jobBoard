const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'db.sitam.me',
  user: 'web501user',
  password: 'web501password', 
  database: 'web501db', 
  connectionLimit: 5
});

module.exports = pool;