const mysql = require("mysql2");
const { pool } = require('../utils/database');
const {body} = require("express/lib/request");
const axios = require('axios');
const { Parser } = require('json2csv');

const csv = require('csv-parser');
const fs = require('fs');
const e = require("cors");

exports.getPersonDetails = async (req, res, err) => {
    let format = req.query.format || 'json';

    if(!(format === 'json' || format === 'csv') || format === '') {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }
    
    // status 400(Bad request) error handling
    if (!req.params.nameID){
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
        const message = { message: 'Invalid nameID parameter! namedID should start with nm', error: err ? err : '' };
        if(format === 'json') 
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv)
        }
    }

    const nameID = req.params.nameID;
    
    const query = `

    SELECT
        p.nconst as nameID, 
        COALESCE(p.primaryName,'') as name,
        COALESCE(p.img_url_asset,'') as namePoster,
        CASE 
            WHEN p.birthYear = '0000' THEN ''
            ELSE p.birthYear
        END as birthYear,
        CASE 
            WHEN p.deathYear = '0000' THEN ''
            ELSE p.deathYear
        END as deathYear,
        COALESCE(pr.category,'') as category,
        COALESCE(pr.tconst,'') as titleID,
        COALESCE(pp.primaryProfession,'') as professions
    FROM
        people p
        LEFT JOIN principals pr ON p.nconst = pr.nconst
        LEFT JOIN primaryprofession pp on pp.nconst = p.nconst
    WHERE
        p.nconst = ?`;

    const queryParams = `${nameID}`;

    pool.getConnection((err, connection) => {
        if (err) {
            const message = { message: 'Error in connection to the database', error: err ? err : '' };
            if(format === 'json') 
                return res.status(500).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(500).send(csv)
            }    
        }
        connection.query(query, queryParams, (err, rows) => {
            connection.release();

            if (err){ 
                const message = { message: 'Error in executing the query' };
                if(format === 'json') 
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv)
                }  
            }
            //status 204(no data) error handling
            if (rows.length === 0) {
                const message = { message: 'No results found' };
                if(format === 'json') 
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv)
                }  
            }
            try {
                const nameObject = processPersonResults(rows);
                if(format === 'json') 
                    return res.status(200).json(nameObject);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(nameObject);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(200).send(csv)
                }
            }
            catch (error) {
                const message = { message: 'Error processing person details', error };
                if(format === 'json') 
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv)
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
    let format = req.query.format || 'json';

    if(!(format === 'json' || format === 'csv')) {
        const message = { message: 'Invalid format parameter! format should be json or csv', error: err ? err : '' };
        return res.status(400).send(message);
    }


    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)){
            const message = { message: 'Limit query param should be an integer' , error : err ? err : ''};
            if(format === 'json') 
                return res.status(400).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(400).send(csv)
            }
        }
    }
    // status 400(Bad request) error handling
    if (req.body.nqueryObject === undefined){
        const message = { message: 'nqueryObject is required' , error : err ? err : ''};
        if(format === 'json')
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv)
        }
    }
    if (req.body.nqueryObject.namePart === undefined){
        const message = { message: 'namePart is required' , error : err ? err : ''};
        if(format === 'json')
            return res.status(400).json(message);
        else{
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(message);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
            return res.status(400).send(csv)
        }
    }     
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

    pool.getConnection((err, connection) => {
        if (err){
            const message = { message: 'Error in connection to the database' };
            if(format === 'json')
                return res.status(500).json(message);
            else{
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(message);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                return res.status(500).send(csv)
            }
        }    
        connection.query(query, queryParams, async (err, rows) => {
            connection.release();

            if (err){
                const message = { message: 'Error in executing the query' , error: err ? err : ''};
                if(format === 'json')
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv)
                }
            } 

            // status 204(no data) error handling
            if (rows.length === 0) {
                // Return a 204 No Content status if there are no results
                const message = { message: 'No results found', error: err ? err : ''};
                if(format === 'json')
                    return res.status(204).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(204).send(csv)
                }
            }
            
            // Map over the nconst values and call getPersonDetails for each one

            const nconst = rows.map(row => row.nconst);
            const nameObjects = [];

            try {
                for (const n of nconst) {
                    const personDetails = await getPersonDetails(n);
                    nameObjects.push(personDetails);
                }
                if(format === 'json')
                    return res.status(200).json(nameObjects);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(nameObjects);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(200).send(csv);
                }
            } catch (error) {
                const message = { message: 'Error processing name details', error: error };
                if(format === 'json')
                    return res.status(500).json(message);
                else{
                    const json2csvParser = new Parser();
                    const csv = json2csvParser.parse(message);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                    return res.status(500).send(csv)
                }
            }
        });
    });
};

async function getPersonDetails(nconst) {
  try {
    const response = await  axios.get(`http://localhost:9876/ntuaflix_api/name/${nconst}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching name details for', nconst, error.message);
    throw error;
  }
}