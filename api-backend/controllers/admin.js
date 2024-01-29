const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
const { modifyTSV_Titles, modifyTSV_Names, modifyTSV_Crew, modifyTSV_Episode } = require('../middlewares/tsv-transformer');
const { Parser } = require('json2csv');

const csv = require('csv-parser');
const fs = require('fs');
const uploadFile = require("../middlewares/upload");
const e = require("express");


//admin 1
exports.healthcheck = async (req, res, next) => {
  let format = req.query.format || 'json';
  
  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {
      const [rows, fields] = await pool.promise().query('SELECT 1');
      const message = { status: 'OK', dataconnection: ['connection string'] };

      if (format == 'json') {
        res.json(message);
      } 
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.send(csv);
      }
    } 
    catch (error) {
      const message = {
        status: 'failed',
        dataconnection: ['connection string'],
      };

      console.error(error);
      if (format == 'json') {
        res.json(message);
      } 
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.send(csv);
      }
    }
};

//admin 9
exports.resetall = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

  try {
    const [rows1, fields1] = await pool.promise().query('DELETE FROM genre');
    const [rows2, fields2] = await pool.promise().query('DELETE FROM akas');
    const [rows3, fields3] = await pool.promise().query('DELETE FROM primaryprofession');
    const [rows4, fields4] = await pool.promise().query('DELETE FROM knowfortitles');
    const [rows5, fields5] = await pool.promise().query('DELETE FROM crewdirectors');
    const [rows6, fields6] = await pool.promise().query('DELETE FROM crewwriters');
    const [rows7, fields7] = await pool.promise().query('DELETE FROM episode');
    const [rows8, fields8] = await pool.promise().query('DELETE FROM principals');
    const [rows9, fields9] = await pool.promise().query('DELETE FROM rating');
    const [rows10, fields10] = await pool.promise().query('DELETE FROM title');
    const [rows11, fields11] = await pool.promise().query('DELETE FROM people');

    const message = {
      status: 'OK',
      message: 'All tables have been reset',
    };

    if (format == 'json') {
        res.json(message);
    }
    else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.send(csv);
    }
  } 
  catch (error) {
    const message = {
      status: 'failed',
      message: 'All tables have not been reset',
    };

    console.error(error);
    if (format == 'json') {
        res.json(message);
    }
    else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.send(csv);
    }
  }
};

function parseAndInsertIntoDatabase(filePath, tableName, columnMappings) {
    return new Promise((resolve, reject) => {
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
                reject(err);
              }
  
              connection.beginTransaction((err) => {
                if (err) {
                  console.error('Error in starting transaction', err);
                  reject(err);
                }
  
                const insertQuery = `INSERT IGNORE INTO ${tableName} (${columnMappings.join(', ')}) VALUES ?`;
                const values = tsvData.map(row => columnMappings.map(column => row[column] === '\\N' || row[column] === '' ? null : row[column]));
  
                connection.query(insertQuery, [values], (err, results) => {
                  if (err) {
                    connection.rollback(() => {
                      console.error('Error in executing the query', err);
                      reject(err);
                    });
                  } else {
                    connection.commit((err) => {
                      if (err) {
                        connection.rollback(() => {
                          console.error('Error in committing transaction', err);
                          reject(err);
                        });
                      } else {
                        console.log('Transaction Complete.');
                        connection.release();
                        resolve();
                      }
                    });
                  }
                });
              });
            });
          });
      } catch (error) {
        reject(error);
      }
    });
}

//admin 2
exports.upload_titlebasics = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {
      const baseDirectory = __dirname + '/../uploads';
      const inputFilePath = req.file.path;
      const filePathGenres = `${baseDirectory}/Genres.tsv`;
      modifyTSV_Titles(inputFilePath, filePathGenres);

      await parseAndInsertIntoDatabase(inputFilePath, 'title', ['tconst', 'titleType', 'primaryTitle', 'originalTitle', 'isAdult','startYear','endYear','runtimeMinutes','img_url_asset']);
      await parseAndInsertIntoDatabase(filePathGenres, 'genre', ['tconst', 'genres']);

      const message = "TSV data inserted into the database successfully.";
      if (format == 'json') {
        res.status(200).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(csv);
      }
    } 
    catch (error) {
      const message = "Error uploading/parsing TSV files.";

      console.error('Error uploading TSV files:', error);
      if (format == 'json') {
        res.status(500).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(500).send(csv);
      }
    }
};

//admin 3
exports.upload_titleakas = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {
      await parseAndInsertIntoDatabase(req.file.path, 'akas', ['titleId', 'ordering', 'title', 'region', 'language', 'types', 'attributes', 'isOriginalTitle']);
      
      const message = "TSV data inserted into the database successfully.";
      if (format == 'json') {
        res.status(200).json(message);
      }
      else {  
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(csv);
      }
    } 
    catch (error) {
      console.error('Error uploading TSV files:', error);

      const message = "Error uploading/parsing TSV files.";
      if (format == 'json') {
        res.status(500).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(500).send(csv);
      }
    }
}

//admin 4
exports.upload_namebasics = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {  
      const baseDirectory = __dirname + '/../uploads';
      const inputFilePath = req.file.path;
      const filePathProfession = `${baseDirectory}/Profession.tsv`;
      const filePathTitles = `${baseDirectory}/Titles.tsv`;
      await modifyTSV_Names(inputFilePath, filePathProfession, filePathTitles);

      await parseAndInsertIntoDatabase(req.file.path, 'people', ['nconst', 'primaryName', 'birthYear', 'deathYear', 'img_url_asset']);
      await parseAndInsertIntoDatabase(filePathProfession, 'primaryprofession', ['nconst', 'primaryProfession']);
      await parseAndInsertIntoDatabase(filePathTitles, 'knowfortitles', ['nconst', 'knownForTitles']);

      const message = "TSV data inserted into the database successfully.";
      if (format == 'json') {
        res.status(200).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(csv);
      }
    } 
    catch (error) {
      console.error('Error uploading TSV files:', error);
      
      const message = "Error uploading/parsing TSV files.";
      if (format == 'json') {
        res.status(500).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(500).send(csv);
      }
    }
};

//admin 5
exports.upload_titlecrew = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {
      const baseDirectory = __dirname + '/../uploads';
      const inputFilePath = req.file.path;
      const filePathDirectors = `${baseDirectory}/Directors.tsv`;
      const filePathWriters = `${baseDirectory}/Writers.tsv`;
      await modifyTSV_Crew(inputFilePath, filePathDirectors, filePathWriters);

      await parseAndInsertIntoDatabase(filePathDirectors, 'crewdirectors', ['tconst', 'directors']);
      await parseAndInsertIntoDatabase(filePathWriters, 'crewwriters', ['tconst', 'writers']);

      const message = "TSV data inserted into the database successfully.";
      if (format == 'json') {
        res.status(200).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(csv);
      }
    } 
    catch (error) {
      //console.error('Error uploading TSV files:', error);
      const message = "Error uploading/parsing TSV files.";
      if (format == 'json') {
        res.status(500).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(500).send(csv);
      }
    }
};

//admin 6
exports.upload_titleepisode = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {
      //console.log(req.file.path);
      const baseDirectory = __dirname + '/../uploads';
      const inputFilePath = req.file.path;
      const filePathEpisode = `${baseDirectory}/Episode.tsv`;
      await modifyTSV_Episode(inputFilePath, filePathEpisode);

      await parseAndInsertIntoDatabase(filePathEpisode, 'episode', ['tconst', 'parentTconst', 'seasonNumber', 'episodeNumber']);

      const message = "TSV data inserted into the database successfully.";
      if (format == 'json') {
        res.status(200).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(csv);
      }
    } 
    catch (error) {
        //console.error('Error uploading TSV files:', error);
        const message = "Error uploading/parsing TSV files.";
        if (format == 'json') {
          res.status(500).json(message);
        }
        else {
          const json2csvParser = new Parser();
          const csv = json2csvParser.parse(message);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
          res.status(500).send(csv);
        }
    }
};

//admin 7
exports.upload_titleprincipals = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {
      console.log(req.file.path);
      await parseAndInsertIntoDatabase(req.file.path, 'principals', ['nconst','tconst', 'ordering', 'category', 'job', 'characters','img_url_asset']);
      
      const message = "TSV data inserted into the database successfully.";
      if (format == 'json') {
        res.status(200).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(csv);
      }
    } 
    catch (error) {
      //console.error('Error uploading TSV files:', error);
      const message = "Error uploading/parsing TSV files.";
      if (format == 'json') {
        res.status(500).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(500).send(csv);
      }
    }
};

//admin 8
exports.upload_titleratings = async (req, res, next) => {
  let format = req.query.format || 'json';

  if(!(format === 'json' || format === 'csv')) {
    const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
    return res.status(400).send(message);
  }

    try {
      console.log(req.file.path);
      await parseAndInsertIntoDatabase(req.file.path, 'rating', ['tconst', 'averageRating', 'numVotes']);

      const message = "TSV data inserted into the database successfully.";
      if (format == 'json') {
        res.status(200).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(200).send(csv);
      }
    } 
    catch (error) {
      //console.error('Error uploading TSV files:', error);
      const message = "Error uploading/parsing TSV files.";
      if (format == 'json') {
        res.status(500).json(message);
      }
      else {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(message);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.status(500).send(csv);
      }
    }
};
