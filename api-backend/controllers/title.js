const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
const axios = require('axios');
const { Parser } = require('json2csv');
const https = require('https');
const { isNumber } = require("util");

const csv = require('csv-parser');
const fs = require('fs');
const { unique } = require("next/dist/build/utils");

exports.getTitleDetails = async (req, res, err) => { 
    let format = req.query.format || 'json';

    if(!(format === 'json' || format === 'csv')) {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }

    //status 400 (bad request) error handling
    if (!req.params.titleID) {
        const message = { message: 'Missing titleID parameter', error: err ? err : ''};
        if(format === 'json') 
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv);
        }
    }
    if (req.params.titleID[0] !== 't' || req.params.titleID[1] !== 't') {
        const message = { message: 'Invalid titleID parameter! titleID should start with tt', error: err ? err : ''};
        if(format === 'json') 
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv);
        }        
    }

    const titleID = req.params.titleID;

    const query = `
    
    SELECT
    t.tconst as titleID, 
    COALESCE(t.titleType,'') as type,
    COALESCE(t.originalTitle, '') as originalTitle,
    COALESCE(t.img_url_asset, '') as titlePoster,
    CASE 
        WHEN t.startYear = '0000' THEN ''
        ELSE t.startYear
    END as startYear,
    CASE 
        WHEN t.endYear = '0000' THEN ''
        ELSE t.endYear
    END as endYear,
    COALESCE(g.genres, '') as genreTitle,
    COALESCE(a.title, '') as akaTitle,
    COALESCE(a.region, '') as regionAbbrev,
    COALESCE(p.nconst, '') as nameID,
    COALESCE(p.primaryName, '') as name,
    COALESCE(pr.category, '') as category,
    COALESCE(r.averageRating, '') as avRating,
    COALESCE(r.numVotes, '') as nVotes
FROM
    title t
    LEFT JOIN genre g ON t.tconst = g.tconst
    LEFT JOIN akas a ON t.tconst = a.titleId
    LEFT JOIN principals pr ON t.tconst = pr.tconst
    LEFT JOIN people p ON pr.nconst = p.nconst
    LEFT JOIN rating r ON t.tconst = r.tconst
WHERE
    t.tconst = ?

UNION ALL

SELECT
    c.tconst as titleID,
    null as type,
    null as originalTitle,
    null as titlePoster,
    null as startYear,
    null as endYear,
    null as genreTitle,
    null as akaTitle,
    null as regionAbbrev,
    p.nconst as nameID,
    p.primaryName as name,
    'director' as category,
    null as avRating,
    null as nVotes
FROM
    crewdirectors c
    JOIN people p ON c.directors = p.nconst
WHERE
    c.tconst = ?

UNION ALL

    SELECT
        c.tconst as titleID,
        null as type,
        null as originalTitle,
        null as titlePoster,
        null as startYear,
        null as endYear,
        null as genreTitle,
        null as akaTitle,
        null as regionAbbrev,
        p.nconst as nameID,
        p.primaryName as name,
        'writer' as category,
        null as avRating,
        null as nVotes
    FROM
        crewwriters c
        JOIN people p ON c.writers = p.nconst
    WHERE
        c.tconst = ?`;

    const queryParams = [`${titleID}`, `${titleID}`, `${titleID}`];

    pool.getConnection((err, connection) => {
        if (err) {
            const message = { message: 'Error in connection to the database', error: err ? err : ''};
            if(format === 'json') 
                return res.status(500).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(500).send(csv);
            }
        }

        connection.query(query, queryParams, (err, rows) => {
            connection.release();

            if (err) {
                const message = { message: 'Error in executing the query', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }
            if (rows.length === 0) {
                const message = { message: 'No results found', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv);
                }
            }
            try {
                const titleObject = processResults(rows);
                if(format === 'json') 
                    return res.status(200).json({titleObject});
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse({titleObject});
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(200).send(csv);
                }  
            }
            catch (error) {
                const message = { message: 'Error processing title details', error: error};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }
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
    const uniqueGenres = new Set(results.filter(result => result.genreTitle != null).map(result => result.genreTitle));
    formattedResponse.genres = [...uniqueGenres].map(genreTitle => ({ genreTitle }));

    // Process titleAkas
    const uniqueTitleAkas = new Set(results.filter(result => result.akaTitle != null && result.regionAbbrev != null).map(result => JSON.stringify({ akaTitle: result.akaTitle, regionAbbrev: result.regionAbbrev })));
    formattedResponse.titleAkas = [...uniqueTitleAkas].map(aka => JSON.parse(aka));

    // Process principals
// Group by nameID and name
const groupedResults = results.reduce((acc, result) => {
    const key = `${result.nameID}-${result.name}`;
    if (!acc[key]) {
        acc[key] = { nameID: result.nameID, name: result.name, category: [result.category] };
    } else {
        // Check if the category already exists for this person
        if (!acc[key].category.includes(result.category)) {
            acc[key].category.push(result.category);
        }
    }
    return acc;
}, {});

// Convert to array and join categories with comma
const uniquePrincipals = Object.values(groupedResults).map(result => ({
    nameID: result.nameID,
    name: result.name,
    category: result.category.join(', ')
}));

formattedResponse.principals = uniquePrincipals;

    return formattedResponse;
}


exports.getSearchByTitle = async (req, res, err) => {
    let limit = undefined;
    let offset = undefined;
    let format = req.query.format || 'json';

    if(!(format === 'json' || format === 'csv')) {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }

    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) {
            const message = { message: 'Limit query param should be an integer', error: (err ? err : '')};
            if(format === 'json') 
                return res.status(400).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(400).send(csv);
            }
        }
    }
    //status 400(Bad Request)  error handling
    if (req.body.tqueryObject.titlePart === undefined) {
        const message = { message: 'Missing titlePart parameter', error: err ? err : ''};
        if(format === 'json') 
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv);
        }
    }

    const titlePart = req.body.tqueryObject.titlePart;

    let page = req.query.page;

    if (!page) {
        page = 1;
    }

    offset = (page - 1) * limit;

    const query = `
        SELECT t.tconst
        FROM Title t
        WHERE t.originalTitle LIKE ?`+ (limit ? ' LIMIT ?' : '') + (offset ? ' OFFSET ?' : '');

    const queryParams = [`%${titlePart}%`];

    // Add the limit parameter to the queryParams if it's provided
    if (limit !== undefined) {
        queryParams.push(limit);
    }
    if (offset !== undefined) {
        queryParams.push(offset);
    }

    pool.getConnection((err, connection) => {
        if (err) {
            const message = { message: 'Error in connection to the database', error: err ? err : ''};
            if(format === 'json') 
                return res.status(500).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(500).send(csv);
            }
        }
        
        connection.query(query, queryParams, async (err, rows) => {
            connection.release();

            if (err) {
                const message = { message: 'Error in executing query', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }

            if (rows.length === 0) {
                const message = { message: 'No results found', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv);
                }
            }

            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];
            try {
                for (const n of tconsts) {
                    const titleDetails = await getTitleDetails(n);
                    titleObjects.push(titleDetails);
                }
                if(format === 'json') 
                    return res.status(200).json(titleObjects);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(titleObjects);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(200).send(csv);
                }
            } catch (error) {
                const message = { message: 'Error processing title details', error: error};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }
        });
    });
};

exports.getTitlesByGenre = async (req, res, err) => {
    let limit = undefined;
    let offset = undefined;
    let format = req.query.format || 'json';
    
    if(!(format === 'json' || format === 'csv')) {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }

    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) {
            const message = { message: 'Limit query param should be an integer', error: (err ? err : '')};
            if(format === 'json') 
                return res.status(400).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(400).send(csv);
            }
        }
    }

    const { qgenre, minrating, yrFrom, yrTo } = req.body.gqueryObject;

    if (!qgenre || !minrating) {
        const message = { message: 'Missing genre or minrating object request param', error: err ? err : ''};
        if(format === 'json') 
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv);
        }
    }

    const attributes = [qgenre, minrating, yrFrom, yrTo].flat().filter(attr => attr !== undefined);
    const uniqueAttributes = [...new Set(attributes)];

    if (
        (attributes.length === 2 && uniqueAttributes.length !== attributes.length) ||
        (attributes.length === 3 && uniqueAttributes.length > 3) ||
        (attributes.length === 4 && uniqueAttributes.length > 3 && yrFrom === yrTo)
    ) {
        const message = { message: 'Duplicate attributes found in the request', error: err ? err : ''};
        if(format === 'json') 
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv);
        }
    }

    let page = req.query.page;

    if (!page) {
        page = 1;
    }

    offset = (page - 1) * limit;

    const query = `
        SELECT t.tconst
        FROM title t
        JOIN genre g ON t.tconst = g.tconst
        JOIN rating r ON t.tconst = r.tconst
        WHERE g.genres = ?
        AND r.averageRating >= ?
        ${yrFrom !== undefined ? 'AND t.startYear >= ?' : ''}
        ${yrTo !== undefined ? 'AND t.startYear <= ?' : ''}` + (limit ? ' LIMIT ?' : '') + (offset ? ' OFFSET ?' : '');

    const queryParams = [qgenre, minrating];

    if (yrFrom !== undefined) {
        queryParams.push(yrFrom);
    }
    
    if (yrTo !== undefined) {
        queryParams.push(yrTo);
    }
    
    if (limit !== undefined) {
        queryParams.push(limit);
    }

    if (offset !== undefined) {
        queryParams.push(offset);
    }
    
    pool.getConnection((err, connection) => {
        if (err) {
            const message = { message: 'Error in connection to the database', error: err ? err : ''};
            if(format === 'json') 
                return res.status(500).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(500).send(csv);
            }
        }

        connection.query(query, queryParams, async (err, rows) => {
            connection.release();
            if (err) {
                const message = { message: 'Error in executing query', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }

            if (rows.length === 0) {
                const message = { message: 'No results found', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv);
                }
            }

            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];

            try {
                for (const n of tconsts) {
                    const titleDetails = await getTitleDetails(n);
                    titleObjects.push(titleDetails);
                }
                if(format === 'json') 
                    return res.status(200).json(titleObjects);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(titleObjects);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(200).send(csv);
                }
            } catch (error) {
                const message = { message: 'Error processing title details', error: error};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }
        });
    });
};

// Function to get title details based on titleID using the getTitleDetails endpoint
async function getTitleDetails(tconst) {
    try {
        const response = await axios.get(`https://localhost:9876/ntuaflix_api/title/${tconst}`,{ httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
        return response.data;
    } catch (error) {
        console.error('Error fetching title details for', tconst, error.message);
        throw error;
    }
}

exports.getSearchByRating = async (req, res, next) => {
    let limit = undefined;
    let offset = undefined;
    let format = req.query.format || 'json';
    
    if(!(format === 'json' || format === 'csv')) {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }

    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) {
            const message = { message: 'Limit query param should be an integer', error: (err ? err : '')};
            if(format === 'json') 
                return res.status(400).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(400).send(csv);
            }
        }
    }

    const { minrating } = req.body.gqueryObject;

    if (!minrating) {
        const message = { message: 'Missing minrating object request param', error: err ? err : ''};
        if(format === 'json') 
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv);
        }
    }

    let page = req.query.page;

    if (!page) {
        page = 1;
    }
    offset = (page - 1) * limit;

    const query = `
        SELECT t.tconst
        FROM title t
        JOIN rating r ON t.tconst = r.tconst
        WHERE r.averageRating >= ? 
    ` + (limit ? ' LIMIT ?' : '') + (offset ? ' OFFSET ?' : '');

    const queryParams = [minrating];

    if (limit !== undefined) {
        queryParams.push(limit);
    }

    if (offset !== undefined) {
        queryParams.push(offset);
    }

    pool.getConnection((err, connection) => {
        if (err) {
            const message = { message: 'Error in connection to the database', error: err ? err : ''};
            if(format === 'json') 
                return res.status(500).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(500).send(csv);
            }
        }

        connection.query(query, queryParams, async (err, rows) => {
            connection.release();
            if (err) {
                const message = { message: 'Error in executing query', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }

            if (rows.length === 0) {
                const message = { message: 'No results found', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv);
                }
            }
            
            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];

            try {
                for (const n of tconsts) {
                    const titleDetails = await getTitleDetails(n);
                    titleObjects.push(titleDetails);
                }
                if(format === 'json') 
                    return res.status(200).json(titleObjects);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(titleObjects);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(200).send(csv);
                }
            } catch (error) {
                const message = { message: 'Error processing title details', error: error};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }
        });
    });
}

exports.getAllGenres = async (req, res, next) => {
    let format = req.query.format || 'json';
    
    if(!(format === 'json' || format === 'csv')) {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }

    const query = `
        SELECT DISTINCT g.genres
        FROM genre g
    `;

    pool.getConnection((err, connection) => {
        if (err) {
            const message = { message: 'Error in connection to the database', error: err ? err : ''};
            if(format === 'json') 
                return res.status(500).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(500).send(csv);
            }
        }

        connection.query(query, async (err, rows) => {
            connection.release();
            if (err) {
                const message = { message: 'Error in executing query', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }

            if (rows.length === 0) {
                const message = { message: 'No results found', error: err ? err : ''};
                if(format === 'json') 
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv);
                }
            }
            
            const genres = rows.map(row => row.genres);
            if(format === 'json') 
                return res.status(200).json(genres);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(genres);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(200).send(csv);
            }
        });
    });
}