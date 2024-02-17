const mysql = require("mysql2");
const { env } = require("process");

/* create connection and export it */
const pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
});

module.exports = { pool };