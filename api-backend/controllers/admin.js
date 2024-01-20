const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
//const axios = require('axios');

const csv = require('csv-parser');
const fs = require('fs');

//admin 1
exports.healthcheck = async (req, res, next) => {
    try {
        const [rows, fields] = await pool.promise().query('SELECT 1');
        res.json({
            status: 'OK',
            dataconnection: ['connection string'],
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: 'failed',
            dataconnection: ['connection string'],
        });
    }
};

//admin 2
exports.upload_titlebasics = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("No TSV file uploaded.");
        }

        // Get the path of the uploaded file
        const filePath = req.file.path;

        // Create a readable stream from the uploaded TSV file
        const stream = fs.createReadStream(filePath);

        // Parse the TSV content
        const tsvData = [];
        stream.pipe(csv({ separator: '\t' })) // Set the separator to tab (\t)
            .on('data', (row) => {
                tsvData.push(row);
            })
            .on('end', async () => {
                // Insert the TSV data into the database
                await insertIntoDatabase(tsvData);

                // Respond with a success message
                res.status(200).send("TSV data inserted into the database successfully.");
            })
            .on('error', (error) => {
                console.error('Error parsing TSV file:', error);
                res.status(500).send("Error parsing TSV file.");
            });
    } catch (error) {
        console.error('Error uploading TSV file:', error);
        res.status(500).send("Error uploading TSV file.");
    }
};

async function insertIntoDatabase(tsvData) {
    // Replace the connection details with your own database connection
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
    });

    try {
        console.log(tsvData);
        // Assuming your TSV has columns like 'column1', 'column2', etc.
        const insertQuery = 'INSERT INTO dummy (column1, column2) VALUES ?';

        // Use promise wrapper for the query
        const values = tsvData.map(row => [row.column1, row.column2]);
        await connection.promise().query(insertQuery, [values]);

        console.log('TSV data inserted into the database successfully.');
    } catch (error) {
        console.error('Error inserting TSV data into the database:', error);
    } finally {
        // Close the database connection
        await connection.end();
    }
}
