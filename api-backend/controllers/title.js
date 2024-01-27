const mysql = require("mysql2");
const { pool } = require('../utils/database');
const { body } = require("express/lib/request");
const axios = require('axios');

const csv = require('csv-parser');
const fs = require('fs');
const { unique } = require("next/dist/build/utils");

exports.getTitleDetails = async (req, res, err) => {
    //status 400 (bad request) error handling
    if (!req.params.titleID) {
        return res.status(400).json({ message: 'Missing titleID parameter', error: err ? err : ''});
    }
    if (req.params.titleID[0] !== 't' || req.params.titleID[1] !== 't') {
        return res.status(400).json({ message: 'Invalid titleID parameter! titleID should start with tt', error: err ? err : ''});
    }
    // if (req.params.titleID.length !== 9) {
    //     return res.status(400).json({ message: 'Invalid titleID parameter! titleID should have 9 characters', error: err? err : ''});
    // }

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
        t.tconst = ?`;

    const queryParams = `${titleID}`;

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
                return res.status(200).json({titleObject});
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
}


exports.getSearchByTitle = async (req, res, err) => {
    let limit = undefined;
    let offset = undefined;

    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer', error: (err ? err : '')});
    }
    //status 400(Bad Request)  error handling
    if (req.body.tqueryObject.titlePart === undefined) {
        return res.status(400).json({ message: 'Missing titlePart parameter', error: err ? err : ''});
    }

    const titlePart = req.body.tqueryObject.titlePart;

    let page = req.query.page;
    const format = req.query.format
    if(!format)


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
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : ''});
        
        connection.query(query, queryParams, async (err, rows) => {
            connection.release();

            if (err) return res.status(500).json({ message: 'Error in executing the query', error: err ? err : ''});

            if (rows.length === 0) {
                // Return a 204 No Content status if there are no results
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }

            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];
            try {
                for (const n of tconsts) {
                    const titleDetails = await getTitleDetails(n);
                    titleObjects.push(titleDetails);
                }
                return res.status(200).json(titleObjects);
            } catch (error) {
                return res.status(500).json({ message: 'Error processing name details', error: error });
            }
        });
    });
};

exports.getTitlesByGenre = async (req, res, next) => {
    let limit = undefined;
    let offset = undefined;

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
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : ''});

        connection.query(query, queryParams, async (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Error in executing query', error: err ? err : ''});

            if (rows.length === 0) {
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }

            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];

            try {
                for (const n of tconsts) {
                    const titleDetails = await getTitleDetails(n);
                    titleObjects.push(titleDetails);
                }
                return res.status(200).json(titleObjects);
            } catch (error) {
                return res.status(500).json({ message: 'Error processing name details', error: error });
            }
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
    let offset = undefined;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer', error: (err ? err : '')});
    }

    const { minrating } = req.body.gqueryObject;

    if (!minrating) {
        return res.status(400).json({ message: 'Minrating object request param should be an integer', error: (err ? err : '')});
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
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : ''});

        connection.query(query, queryParams, async (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Error in executing query', error: err ? err : ''});

            if (rows.length === 0) {
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }
            
            const tconsts = rows.map(row => row.tconst);
            const titleObjects = [];

            try {
                for (const n of tconsts) {
                    const titleDetails = await getTitleDetails(n);
                    titleObjects.push(titleDetails);
                }
                return res.status(200).json(titleObjects);
            } catch (error) {
                return res.status(500).json({ message: 'Error processing name details', error: error });
            }
        });
    });
}

exports.getAllGenres = async (req, res, next) => {
    const query = `
        SELECT DISTINCT g.genres
        FROM genre g
    `;

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: 'Error in connection to the database', error: err ? err : ''});

        connection.query(query, async (err, rows) => {
            connection.release();
            if (err) return res.status(500).json({ message: 'Error in executing query', error: err ? err : ''});

            if (rows.length === 0) {
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }
            
            const genres = rows.map(row => row.genres);
            return res.status(200).json(genres);
        });
    });
}