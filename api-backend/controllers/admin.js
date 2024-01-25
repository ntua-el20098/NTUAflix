const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
const { modifyTSV_Names, modifyTSV_Crew } = require('../middlewares/tsv-transformer');
const { modifyTSV_Titles } = require('../middlewares/tsv_transformer'); 

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

exports.resetall = async (req, res, next) => {
    try {
        const [rows1, fields1] = await pool.promise().query('DELETE FROM genre');
        const [rows2, fields2] = await pool.promise().query('DELETE FROM akas');
        const [rows3, fields3] = await pool.promise().query('DELETE FROM primaryprofession');
        const [rows4, fields4] = await pool.promise().query('DELETE FROM knowfortitles');
        //const [rows5, fields5] = await pool.promise().query('DELETE FROM titlecrew');
        const [rows6, fields6] = await pool.promise().query('DELETE FROM episode');
        const [rows7, fields7] = await pool.promise().query('DELETE FROM principals');
        const [rows8, fields8] = await pool.promise().query('DELETE FROM rating');
        const [rows9, fields9] = await pool.promise().query('DELETE FROM people');
        const [rows10, fields10] = await pool.promise().query('DELETE FROM title');
        res.json({
            status: 'OK',
            message: 'All tables have been reset',
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: 'failed',
            message: 'All tables have not been reset',
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
         modifyTSV_Titles(inputFilePath, filePathGenres);

         await parseAndInsertIntoDatabase(inputFilePath, 'title', ['tconst', 'titleType', 'primaryTitle', 'originalTitle', 'isAdult','startYear','endYear','runtimeMinutes','img_url_asset']);
         await parseAndInsertIntoDatabase(filePathGenres, 'genre', ['tconst', 'genres']);

        res.status(200).send("TSV data inserted into the database successfully.");
    } catch (error) {
        console.error('Error uploading TSV files:', error);
        res.status(500).send("Error uploading/parsing TSV files.");
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
                const values = tsvData.map(row => columnMappings.map(column => row[column] === '\\N' ? null : row[column]));
  
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

//admin 9
/*exports.resetall = async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        if (!connection) {
            console.error('Error: Unable to acquire a database connection.');
            res.status(500).send("Error deleting data from database.");
            return;
        }

        await connection.beginTransaction();

        await pool.query('DELETE FROM akas');
        await pool.query('DELETE FROM crewdirectors');
        await pool.query('DELETE FROM crewwriters');
        await pool.query('DELETE FROM episode');
        await pool.query('DELETE FROM genre');
        await pool.query('DELETE FROM knowfortitles');
        await pool.query('DELETE FROM principals');
        await pool.query('DELETE FROM primaryprofession');
        await pool.query('DELETE FROM rating');
        await pool.query('DELETE FROM people');
        await pool.query('DELETE FROM title');

        await connection.commit();
        res.status(200).send("All data deleted successfully.");
    } catch (error) {
        console.error('Error deleting data from database:', error);
        await connection.rollback();
        res.status(500).send("Error deleting data from database.");
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
*/

exports.resetall = async (req, res, next) => {
    try {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error in connection to the database', err);
          res.status(500).send('Error in connection to the database');
          return;
        }
  
        const deleteQueries = [
          'DELETE FROM akas',
          'DELETE FROM crewdirectors',
          'DELETE FROM crewwriters',
          'DELETE FROM episode',
          'DELETE FROM genre',
          'DELETE FROM knowfortitles',
          'DELETE FROM principals',
          'DELETE FROM primaryprofession',
          'DELETE FROM rating',
          'DELETE FROM people',
          'DELETE FROM title'
        ];
  
        const queryPromises = deleteQueries.map(query => {
          return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
              if (err) {
                console.error('Error in executing the query', err);
                reject(err);
              } else {
                resolve(results);
              }
            });
          });
        });
  
        Promise.all(queryPromises)
          .then(results => {
            connection.release();
            console.log('All queries executed successfully.');
            res.status(200).send('All data deleted successfully.');
          })
          .catch(error => {
            connection.release();
            console.error('Error executing queries:', error);
            res.status(500).send('Error executing queries.');
          });
      });
    } catch (error) {
      console.error('Error uploading/parsing TSV file:', error);
      res.status(500).send('Error uploading/parsing TSV file.');
    }
  };
  