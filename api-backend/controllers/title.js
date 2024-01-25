const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
const axios = require('axios');

const csv = require('csv-parser');
const fs = require('fs');
const { unique } = require("next/dist/build/utils");

exports.getTitleDetails = async (req, res, err) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json(
            { message: 'Limit query param should be an integer', error: (err ? err : '')} );
    }

    //status 400
    if (!req.params.titleID) {
        return res.status(400).json({ message: 'Missing titleID parameter', error: err ? err : ''});
    }

    if (req.params.titleID[0] !== 't' || req.params.titleID[1] !== 't') {
        return res.status(400).json({ message: 'Invalid titleID parameter', error: err ? err : ''});
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
        g.genres as genreTitle,
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
        JOIN akas a ON t.tconst = a.titleId
        JOIN principals pr ON t.tconst = pr.tconst
        JOIN people p ON pr.nconst = p.nconst
        JOIN rating r ON t.tconst = r.tconst
    WHERE
        t.tconst = '${titleID}'` + (limit ? ' LIMIT ?' : '');

    const queryParams = [titleID];

    if (limit !== undefined) {
        queryParams.push(limit);
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : '' });

        connection.query(query, queryParams, (err, rows) => {
            connection.release();

            if (err) return res.status(500).json({ message: 'Error in executing the query', error: err ? err : '' });
            if (rows.length === 0) {
                // Return a 204 No Content status if there are no results
                return res.status(204).json({ message: 'No results found', error: err ? err : '' });
            }
            try {
                const titleObject = processResults(rows);
                return res.status(200).json(titleObject);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error processing title details', error: error});
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


exports.getSearchByTitle = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer', error: (err ? err : '')});
    }

    if (!req.body.tqueryObject.titlePart) {
        return res.status(400).json({ message: 'Missing titlePart parameter', error: err ? err : ''});
    }

    const titlePart = req.body.tqueryObject.titlePart;

    const query = `
        SELECT t.tconst
        FROM Title t
        WHERE t.originalTitle LIKE "%${titlePart}%"`+ (limit ? ' LIMIT ?' : '');

    const queryParams = [titlePart];

    // Add the limit parameter to the queryParams if it's provided
    if (limit !== undefined) {
        queryParams.push(limit);
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : ''});
        
        connection.query(query, queryParams,(err, rows) => {
            connection.release();

            if (err) return res.status(500).json({ message: 'Error in executing the query', error: err ? err : ''});

            if (rows.length === 0) {
                // Return a 204 No Content status if there are no results
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }

            // Map over the tconst values and call getTitleDetails for each one
            const titleDetailsPromises = rows.map(row => getTitleDetails(row.tconst));

            const titleObjects = [];

            // Use Promise.all to wait for all the getTitleDetails requests to complete
            Promise.all(titleDetailsPromises)
                .then(titleObjects => {
                    // Return the array of title details in the response
                    res.status(200).json(titleObjects);
                })
                .catch(error => {
                    return res.status(500).json({ message: 'Error processing title details', error: error});
                });
        });
    });
};

exports.getTitlesByGenre = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer', error: (err ? err : '')});
    }

    const { qgenre, minrating, yrFrom, yrTo } = req.body.gqueryObject;

    if (!qgenre || !minrating) {
        return res.status(400).json({ message: 'Invalid or missing input parameters', error: err ? err : ''});
    }

    const attributes = [qgenre, minrating, yrFrom, yrTo].flat().filter(attr => attr !== undefined);
    const uniqueAttributes = [...new Set(attributes)];

    if (
        (attributes.length === 2 && uniqueAttributes.length !== attributes.length) ||
        (attributes.length === 3 && uniqueAttributes.length > 3) ||
        (attributes.length === 4 && uniqueAttributes.length > 3 && yrFrom === yrTo)
    ) {
        return res.status(400).json({ message: 'Duplicate parameters detected', error: err ? err : ''});
    }

    const query = `
        SELECT t.tconst
        FROM title t
        JOIN genre g ON t.tconst = g.tconst
        JOIN rating r ON t.tconst = r.tconst
        WHERE g.genres = ?
        AND r.averageRating >= ?
        ${yrFrom !== undefined ? 'AND t.startYear >= ?' : ''}
        ${yrTo !== undefined ? 'AND t.startYear <= ?' : ''}` + (limit ? ' LIMIT ?' : '');

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
    
    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : ''});

        connection.query(query, queryParams, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Error in executing query', error: err ? err : ''});

            if (rows.length === 0) {
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }

            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];

            Promise.all(tconsts.map(tconst => getTitleDetails(tconst)))
                .then(titleDetailsArray => {
                    titleObjects.push(...titleDetailsArray);
                    return res.status(200).json(titleObjects);
                })
                .catch(error => {
                    return res.status(500).json({ message: 'Error processing title details', error: error });
                });
        });
    });
};

// Function to get title details based on titleID using the getTitleDetails endpoint
async function getTitleDetails(tconst) {
    try {
        const response = await axios.get(`http://localhost:9876/ntuaflix_api/title/${tconst}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching title details for', tconst, error.message);
        throw error;
    }
}

exports.getSearchByRating = async (req, res, next) => {
    let limit = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer', error: (err ? err : '')});
    }

    const { minrating } = req.body.gqueryObject;

    if (!minrating) {
        return res.status(400).json({ message: 'Minrating object request param should be an integer', error: (err ? err : '')});
    }

    const query = `
        SELECT t.tconst
        FROM title t
        JOIN rating r ON t.tconst = r.tconst
        WHERE r.averageRating >= ? 
    ` + (limit ? ' LIMIT ?' : '');

    const queryParams = [minrating];

    if (limit !== undefined) {
        queryParams.push(limit);
    }

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : ''});

        connection.query(query, queryParams, (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Error in executing query', error: err ? err : ''});

            if (rows.length === 0) {
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }
            
            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];

            Promise.all(tconsts.map(tconst => getTitleDetails(tconst)))
                .then(titleDetailsArray => {
                    titleObjects.push(...titleDetailsArray);
                    return res.status(200).json(titleObjects);
                })
                .catch(error => {
                    return res.status(500).json({ message: 'Error processing title details', error: error });
                });
        });
    });
}
