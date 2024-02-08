const mysql = require("mysql2");
const { pool } = require('../utils/database');
const {body} = require("express/lib/request");
const axios = require('axios');
const { Parser } = require('json2csv');

const csv = require('csv-parser');
const fs = require('fs');

exports.getPersonDetails = async (req, res, err) => {
    let limit = undefined;
    let format = req.query.format || 'json';

    if(!(format === 'json' || format === 'csv')) {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)){
            const message = { message: 'Limit query param should be an integer' };
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

    // status 400(Bad request) error handling
    if (req.params.nameID === undefined){
        const message = { message: 'nameID is required', error: err ? err : '' };
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
    if (req.params.nameID[0] !== 'n' || req.params.nameID[1] !== 'm') {
        const message ={ message: 'Invalid nameID parameter! namedID should start with nm', error: err ? err : ''};
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
    if (req.params.nameID.length !== 9) {
        const message ={ message: 'Invalid nameID parameter! namedID should have 9 characters', error: err? err : ''};
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
    const nameID = req.params.nameID;
    
    
    const query = `
    SELECT
        p.nconst as nameID, 
        p.primaryName as name,
        p.img_url_asset as namePoster,
        p.birthYear as birthYr,
        p.deathYear as deathYr,
        pr.category as category,
        pr.tconst as titleID,
        pp.primaryProfession as professions
    FROM
        people p
        JOIN principals pr ON p.nconst = pr.nconst
        JOIN primaryprofession pp on pp.nconst = p.nconst
    WHERE
        p.nconst = '${nameID}'` + (limit ? ' LIMIT ?' : '');

    const queryParams = [nameID];

    if (limit !== undefined) {
        queryParams.push(limit);
    }

    pool.getConnection((err, connection) => {
        if (err){
            const message ={ message: 'Error in connection to the database' };
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

            if (err){
                const message ={ message: 'Error in executing the query' };
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
            //status 204(no data) error handling
            if (rows.length === 0) {
                const message ={ message: 'No results found' };
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
                const nameObject = processPersonResults(rows);
                if(format === 'json')
                    return res.status(500).json({nameObject});
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse({nameObject});
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv);
                }
            }
            catch (error) {
                const message ={ message: 'Error processing person details', error };
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

// Helper function to process the SQL results and format the response for getPersonDetails
function processPersonResults(results) {

    if (!results || results.length === 0) {
        // Handle the case when no results are found
        return { message: 'No results found' };
    }

    const professions = results.map(result => result.professions);
    let ProfessionsString = professions.join(',');

    const formattedResponse = {
        nameID: results[0].nameID,
        name: results[0].name,
        namePoster: results[0].namePoster,
        birthYr: results[0].birthYr,
        deathYr: results[0].deathYr,
        profession: ProfessionsString,
        nameTitles: []
    };

    // Process nameTitles
    const uniquenameTitles = new Set(results.map(result => JSON.stringify({ titleID: result.titleID, category: result.category })));
    formattedResponse.nameTitles = [...uniquenameTitles].map(nameTitle => JSON.parse(nameTitle));

    return formattedResponse;
}

exports.getSearchPersonByName = async (req, res, err) => {
    let limit = undefined;
    let offset = undefined;

    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ message: 'Limit query param should be an integer' , error :err ? err : ''});
    }
    // status 400(Bad request) error handling
    if (req.body.nqueryObject === undefined) return res.status(400).json({ message: 'nqueryObject is required' , error : err ? err : ''});
    if (req.body.nqueryObject.namePart === undefined) return res.status(400).json({ message: 'namePart is required' , error : err ? err : ''});
    const namePart = req.body.nqueryObject.namePart;

    let page = req.query.page;

    if (!page) {
        page = 1;
    }


    offset = (page - 1) * limit;

    const query = `
        SELECT p.nconst
        FROM people p
        WHERE p.primaryName LIKE ?`+ (limit ? ' LIMIT ?' : '') + (offset ? ' OFFSET ?' : '');

        const queryParams = [`%${namePart}%`];
   

    // Add the limit parameter to the queryParams if it's provided
    if (limit !== undefined) {
        queryParams.push(limit);
    }

    if (offset !== undefined) {
        queryParams.push(offset);
    }
    console.log(queryParams);   

    pool.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: 'Error in connection to the database' });

        connection.query(query, queryParams, (err, rows) => {
            connection.release();

            if (err) return res.status(500).json({ message: 'Error in executing the query' , error: err ? err : ''});

            // status 204(no data) error handling
            if (rows.length === 0) {
                // Return a 204 No Content status if there are no results
                return res.status(204).json({ message: 'No results found', error: err ? err : ''});
            }
            
            // Map over the nconst values and call getPersonDetails for each one
            const nameDetailsPromises = rows.map(row => getPersonDetails(row.nconst).catch(error => {
                console.error('Error fetching person details for', row.nconst);
                return null; // return null if there's an error
            }));
            const nameObjects = [];

            // Use Promise.all to wait for all the getPersonDetails requests to complete
            Promise.all(nameDetailsPromises)
                .then(nameObjects => {
                    // Return the array of person details in the response
                    res.status(200).json(nameObjects);
                })
                .catch(error => {
                    return res.status(500).json({ message: 'Error processing person details!', error });
                });
        });
    });
};

// Function to get person details based on nameID using the getPersonDetails endpoint
async function getPersonDetails(nconst) {
    try {
        const response = await axios.get(`http://localhost:9876/ntuaflix_api/name/${nconst}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching name details for', nconst, error.message);
        throw error;
    }
}