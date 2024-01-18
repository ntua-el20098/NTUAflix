const { pool } = require('../utils/database');

exports.getTitlesByGenre = async(req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' });
    }

    const {qgenre, minrating, yrFrom, yrTo } = req.body.gqueryObject;

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
}

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


//exports.getPersonDetails = async ()