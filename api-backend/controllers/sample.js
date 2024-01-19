const { pool } = require('../utils/database');
const {body} = require("express/lib/request");
const axios = require('axios');

exports.getTitlesByGenre = async (req, res, next) => {
    console.log('Entire Request Object:', req);
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const { qgenre, minrating, yrFrom, yrTo } = req.body;

    if (!qgenre || !minrating || isNaN(minrating)) {
        return res.status(400).json({ message: 'Invalid or missing input parameters' });
    }

    // Check for duplicate attributes in the gquery
    const attributes = [qgenre, minrating, yrFrom, yrTo];
    const hasDuplicates = new Set(attributes).size !== attributes.filter(attr => attr !== undefined).length;
    if (hasDuplicates) {
        return res.status(400).json({ message: 'Too many attributes' });
    }

    const query = `SELECT t.tconst
    FROM Title t
    JOIN Genre g ON t.tconst = g.tconst
    JOIN Rating r ON t.tconst = r.tconst
    WHERE g.genre = ?
      AND r.averageRating >= ?
      ${yrFrom !== undefined ? 'AND t.startYear >= ?' : ''}
      ${yrTo !== undefined ? 'AND t.startYear <= ?' : ''}
  ` + (limit ? ' LIMIT ?' : '');

    const queryParams = [qgenre, minrating];

    // Add the yrFrom parameter to the queryParams if it's provided
    if (yrFrom !== undefined) {
        queryParams.push(yrFrom);
    }

    // Add the yrTo parameter to the queryParams if it's provided
    if (yrTo !== undefined) {
        queryParams.push(yrTo);
    }

    // Add the limit parameter to the queryParams if it's provided
    if (limit !== undefined) {
        queryParams.push(limit);
    }

    pool.getConnection((err, connection) => {
        connection.query(query, queryParams, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];

            // Use Promise.all to wait for all getTitleDetails requests to complete
            Promise.all(tconsts.map(tconst => getTitleDetails(tconst)))
                .then(titleDetailsArray => {
                    titleObjects.push(...titleDetailsArray);
                    return res.status(200).json(titleObjects);
                })
                .catch(error => {
                    return res.status(500).json({ message: 'Error processing title details', error });
                });
        });
    });
};

// Function to get title details based on titleID using the getTitleDetails endpoint
async function getTitleDetails(tconst) {
    try {
        const response = await axios.get(`http://localhost:3000/api/samples/title/${tconst}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching title details for', tconst, error.message);
        throw error;
    }
}


exports.getTitleDetails = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const titleID = req.params.titleID;

    const query = `
        
    SELECT
    t.tconst as titleID, 
    t.titleType as type,
    t.originalTitle,
    t.img_url_asset as titlePoster,
    t.startYear,
    t.endYear,
    g.genre as genreTitle,
    a.title as akaTitle,
    a.region as regionAbbrev,
    p.nconst as nameID,
    p.primaryName as name,
    pr.category as category,
    r.averageRating as avRating,
    r.numVotes as nVotes
FROM
    title t
     JOIN genre g ON t.tconst = g.tconst
     JOIN akas a ON t.tconst = a.tconst
     JOIN principals pr ON t.tconst = pr.tconst
     JOIN people p ON pr.nconst = p.nconst
     JOIN rating r ON t.tconst = r.tconst
WHERE
    t.tconst = '${titleID}'`;

    if (limit) {
        query += ` LIMIT ${limit}`;
    }

    pool.getConnection((err, connection) => {
        connection.query(query, titleID, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });
            const formattedResponse = processResults(rows);
            return res.status(200).json(formattedResponse);
        });
    });
};

// Helper function to process the SQL results and format the response
function processResults(results) {
    if (!results || results.length === 0) {
        // Handle the case when no results are found
        return { message: 'No results found' };
    }

    const formattedResponse = {
        titleID: results[0].titleID,
        type: results[0].type,
        originalTitle: results[0].originalTitle,
        titlePoster: results[0].titlePoster,
        startYear: results[0].startYear,
        endYear: results[0].endYear,
        genres: [],
        titleAkas: [],
        principals: [],
        rating: {
            avRating: results[0].avRating,
            nVotes: results[0].nVotes
        }
    };

    // Process genres
    const uniqueGenres = new Set(results.map(result => result.genreTitle));
    formattedResponse.genres = [...uniqueGenres].map(genreTitle => ({ genreTitle }));

    // Process titleAkas
    const uniqueTitleAkas = new Set(results.map(result => JSON.stringify({ akaTitle: result.akaTitle, regionAbbrev: result.regionAbbrev })));
    formattedResponse.titleAkas = [...uniqueTitleAkas].map(aka => JSON.parse(aka));

    // Process principals
    const uniquePrincipals = new Set(results.map(result => JSON.stringify({ nameID: result.nameID, name: result.name, category: result.category })));
    formattedResponse.principals = [...uniquePrincipals].map(principal => JSON.parse(principal));

    return formattedResponse;
    
};


// no table correlation between titles, people and category
exports.getSearchPersonByName = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const namePart = req.body.nqueryObject.namePart;

    const query = `
    SELECT p.nconst, p.primaryName, p.img_url_asset, p.birthYear, p.deathYear, pr.profession
    FROM people p
    JOIN profession pr ON p.nconst = pr.nconst
    WHERE p.primaryName LIKE "%?%"`+ (limit ? ' LIMIT ?' : '');

            // Add the limit parameter to the queryParams if it's provided
            if (limit !== undefined) {
                queryParams.push(limit);
            }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: 'Database connection ERROR' });

        connection.query(query, queryParams, (err, rows) => {
            connection.release();

            if (err) return res.status(500).json({ message: 'Query execution ERROR' });

            const formattedResponse = format_getSearchPersonByName(rows);
            return res.status(200).json(formattedResponse);
        });
    });
};

function format_getSearchPersonByName(results) {
    const formattedResponse = {
        nameObject: {
            nameID: results[0].nameID,
            name: results[0].name,
            namePoster: results[0].namePoster,
            birthYr: results[0].birthYr,
            deathYr: results[0].deathYr,
            profession: results[0].profession,
            nameTitles: [],
            titleID: results[0].titleID,
            category: results[0].category
        }
    };

    // Process nameTitles
    const uniqueNameTitles = new Set(results.map(result => JSON.stringify({ titleID: result.titleID, category: result.category })));
    formattedResponse.nameObject.nameTitles = [...uniqueNameTitles].map(nameTitle => JSON.parse(nameTitle));

    return formattedResponse;
    
};

exports.getSearchByTitle = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const titlePart = req.body.tqueryObject.titlePart;

    const query = `
    SELECT t.tconst, t.titleType, t.primaryTitle, t.originalTitle, t.isAdult, t.startYear, t.endYear, t.runtimeMinutes, t.img_url_asset
    FROM Title t
    WHERE t.originalTitle LIKE "%${titlePart}%"`+ (limit ? ' LIMIT ?' : '');

    const queryParams = [titlePart];

        // Add the limit parameter to the queryParams if it's provided
        if (limit !== undefined) {
            queryParams.push(limit);
        }

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error in connection to the database' });
        }

        connection.query(query, queryParams,(err, results) => {
            connection.release();

            if (err) {
                return res.status(500).json({ message: 'Error in executing the query' });
            }

            res.status(200).json(results);
        });
    });
};

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

    console.log(req.body.src);

    try {
      // Ensure that the request body has the 'tsv_data' field
      if (!req.body || !req.body.tsv_data) {
        return res.status(400).json({ error: 'Missing TSV data in the request body' });
      }
  
      // Read TSV data from the request body
      const tsvData = req.body.tsv_data;
  
      // Process the TSV data (for example, you can insert it into your database)
      // Implement your database logic here...
  
      // For demonstration purposes, let's assume we save the TSV data to a file
      const filePath = path.join(__dirname, 'uploaded_data.tsv');
      fs.writeFileSync(filePath, tsvData, 'utf-8');
  
      // Respond with a success message (modify as needed)
      res.status(200).json({ message: 'TSV data uploaded successfully', filePath });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

