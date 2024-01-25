const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
const { modifyTSV_Names, modifyTSV_Crew } = require('../middlewares/tsv-transformer');
const { modifyTSV_Titles } = require('../middlewares/tsv_transformer'); 

const csv = require('csv-parser');
const fs = require('fs');
const uploadFile = require("../middlewares/upload");


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
        //console.log(req.file.path);
        const baseDirectory = __dirname + '/../uploads';
        const inputFilePath = req.file.path;
        const filePathGenres = `${baseDirectory}/Genres.tsv`;
        await modifyTSV_Titles(inputFilePath, filePathGenres);

        await parseAndInsertIntoDatabase(inputFilePath, 'title', ['tconst', 'titleType', 'primaryTitle', 'originalTitle', 'isAdult','startYear','endYear','runtimeMinutes','img_url_asset']);
        await parseAndInsertIntoDatabase(filePathGenres, 'genre', ['tconst', 'genres']);

        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
};

async function parseAndInsertIntoDatabase(filePath, tableName, columnMappings) {
    try {
        const stream = fs.createReadStream(filePath);
        const tsvData = [];
    
        stream.pipe(csv({ separator: '\t' }))
          .on('data', (row) => {
            tsvData.push(row);
          })
          .on('end', () => {
            // get a connection from the pool
            pool.getConnection((err, connection) => {
              if (err) {
                console.error('Error in connection to the database', err);
                return;
              }
    
              const insertQuery = `INSERT IGNORE INTO ${tableName} (${columnMappings.join(', ')}) VALUES ?`;
              const values = tsvData.map(row => columnMappings.map(column => row[column] === '\\N' ? null : row[column]));
              //console.log(values);
    
              // use the connection to execute your queries
              connection.query(insertQuery, [values], (err, results) => {
                // always release the connection when you're done
                connection.release();
    
                if (err) {
                  console.error('Error in executing the query', err);
                  return;
                }
    
                // process the results
                console.log('TSV data inserted into the database successfully.');
              });
            });
          })
          .on('error', (error) => {
            console.error('Error parsing TSV file:', error);
          });
      } catch (error) {
        console.error('Error uploading/parsing TSV file:', error);
      }
    }

//admin 3
exports.upload_titleakas = async (req, res, next) => {
    try {
        console.log(req.file.path);
        await parseAndInsertIntoDatabase(req.file.path, 'akas', ['titleId', 'ordering', 'title', 'region', 'language', 'types', 'attributes', 'isOriginalTitle']);
        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
}

//admin 4
exports.upload_namebasics = async (req, res, next) => {
    try {
        //console.log(req.file.path);
        const baseDirectory = __dirname + '/../uploads';
        const inputFilePath = req.file.path;
        const filePathProfession = `${baseDirectory}/Profession.tsv`;
        const filePathTitles = `${baseDirectory}/Titles.tsv`;
        await modifyTSV_Names(inputFilePath, filePathProfession, filePathTitles);

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
        //console.log(req.file.path);
        const baseDirectory = __dirname + '/../uploads';
        const inputFilePath = req.file.path;
        const filePathDirectors = `${baseDirectory}/Directors.tsv`;
        const filePathWriters = `${baseDirectory}/Writers.tsv`;
        await modifyTSV_Crew(inputFilePath, filePathDirectors, filePathWriters);

        await parseAndInsertIntoDatabase(filePathDirectors, 'crewdirectors', ['tconst', 'directors']);
        await parseAndInsertIntoDatabase(filePathWriters, 'crewwriters', ['tconst', 'writers']);

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
        await parseAndInsertIntoDatabase(req.file.path, 'episode', ['tconst', 'parentTconst', 'seasonNumber', 'episodeNumber']);
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
        await parseAndInsertIntoDatabase(req.file.path, 'principals', ['nconst','tconst', 'ordering', 'category', 'job', 'characters','img_url_asset']);
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
        await parseAndInsertIntoDatabase(req.file.path, 'rating', ['tconst', 'averageRating', 'numVotes']);
        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
    }
};

