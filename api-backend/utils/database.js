const mysql = require("mysql2");
const { env } = require("process");

/* create connection and export it */
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'tl',
});

module.exports = { pool };