const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
//const axios = require('axios');

const csv = require('csv-parser');
const fs = require('fs');
const uploadFile = require("../middlewares/upload");
const e = require("express");

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
        
        console.log(req.file.path);
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

async function parseAndInsertIntoDatabase(filePath, tableName, columnMappings) {
    const connection = await pool.getConnection();

    try {
        const stream = fs.createReadStream(filePath);
        const tsvData = [];

        stream.pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                tsvData.push(row);
            })
            .on('end', async () => {
                const insertQuery = `INSERT INTO ${tableName} (${columnMappings.join(', ')}) VALUES ?`;
                const values = tsvData.map(row => columnMappings.map(column => row[column]));

                await connection.promise().query(insertQuery, [values]);
                console.log('TSV data inserted into the database successfully.');
            })
            .on('error', (error) => {
                console.error('Error parsing TSV file:', error);
            });
    } catch (error) {
        console.error('Error uploading/parsing TSV file:', error);
    } finally {
        connection.release();
    }
}

//admin 3
exports.upload_titleakas = async (req, res, next) => {
    try {
        console.log(req.file.path);
        await parseAndInsertIntoDatabase(req.file.path, 'titleakas', ['titleId', 'ordering', 'title', 'region', 'language', 'types', 'attributes', 'isOriginalTitle']);
        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
}

//admin 4
exports.upload_namebasics = async (req, res, next) => {
    try {
        console.log(req.file.path);
        const baseDirectory = __dirname + '/../uploads';
        const filePathProfession = `${baseDirectory}/Profession.tsv`;
        const filePathTitles = `${baseDirectory}/Titles.tsv`;

        await parseAndInsertIntoDatabase(req.file.path, 'people', ['nconst', 'primaryName', 'birthYear', 'deathYear', 'img_url_asset']);
        await parseAndInsertIntoDatabase(filePathProfession, 'primaryprofession', ['nconst', 'primaryProfession']);
        await parseAndInsertIntoDatabase(filePathTitles, 'knowfortitles', ['nconst', 'knownForTitles']);

        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
};

//admin 5
exports.upload_titlecrew = async (req, res, next) => {
    try {
        console.log(req.file.path);
        await parseAndInsertIntoDatabase(req.file.path, 'titlecrew', ['tconst', 'directors', 'writers']);
        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
};

//admin 6
exports.upload_titleepisode = async (req, res, next) => {
    try {
        console.log(req.file.path);
        await parseAndInsertIntoDatabase(req.file.path, 'titleepisode', ['tconst', 'parentTconst', 'seasonNumber', 'episodeNumber']);
        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
};

//admin 7
exports.upload_titleprincipals = async (req, res, next) => {
    try {
        console.log(req.file.path);
        await parseAndInsertIntoDatabase(req.file.path, 'titleprincipals', ['tconst', 'ordering', 'nconst', 'category', 'job', 'characters']);
        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
};

//admin 8
exports.upload_titleratings = async (req, res, next) => {
    try {
        console.log(req.file.path);
        await parseAndInsertIntoDatabase(req.file.path, 'titleratings', ['tconst', 'averageRating', 'numVotes']);
        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
};

