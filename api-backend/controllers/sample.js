const { pool } = require('../utils/database');

exports.getTitlesByGenre = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const { qgenre, minrating, yrFrom, yrTo } = req.body.gqueryObject;

    if (!qgenre || !minrating || isNaN(minrating)) {
        return res.status(400).json({ message: 'Invalid or missing input parameters' });
    }

    // Check for duplicate attributes in the gqueryObject
    const attributes = [qgenre, minrating, yrFrom, yrTo];
    const hasDuplicates = new Set(attributes).size !== attributes.filter(attr => attr !== undefined).length;
    if (hasDuplicates) {
        return res.status(400).json({ message: 'Too many attributes' });
    }

    const query = `SELECT t.tconst, t.titleType, t.primaryTitle, t.originalTitle, t.isAdult, t.startYear, t.endYear, t.runtimeMinutes, t.img_url_asset
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

            return res.status(200).json(rows);
        });
    });
};

exports.getTitleDetails = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const titleID = req.params.titleID;
    console.log(titleID);

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

// pws kserw oti epistrefei lista apo obj
// morfopoihsh listas nameTitles sto nameObject
exports.getSearchPersonByName = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const namePart = req.body.nqueryObject;

    const query = `
    SELECT p.nconst, p.primaryName, p.img_url_asset, p.birthYear, p.deathYear, pr.profession
    FROM people p
    JOIN profession pr ON p.nconst = pr.nconst
    WHERE p.primaryName LIKE "%?%"`+ (limit ? ' LIMIT ?' : '');

    const queryParams = [namePart, limit].filter(param => param !== undefined);

    pool.getConnection((err, connection) => {
        connection.query(query, queryParams, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Internal server error' });

            return res.status(200).json(rows);
        });
    });
};

exports.getSearchByTitle = async (req, res, next) => {
    const titlePart = `%${req.params.titlePart}%`;

    const query = `
        SELECT *
        FROM title t
        WHERE t.originalTitle LIKE ?
    `;

    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error in connection to the database' });
        }

        connection.query(query, [titlePart], (err, results) => {
            connection.release();

            if (err) {
                return res.status(500).json({ message: 'Error in executing the query' });
            }

            res.status(200).json(results);
        });
    });
};


//admin
/*exports.healthcheckController = async (req, res, next) => {
    try {
      await Database.checkConnection();
      res.json({
        status: 'OK',
        dataconnection: ['connection string'],
      });
    } catch (error) {
      res.json({
        status: 'failed',
        dataconnection: ['connection string'],
      });
    }
  };
*/