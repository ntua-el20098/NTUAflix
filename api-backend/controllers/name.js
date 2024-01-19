const mysql = require("mysql2");
const { pool } = require('../utils/database');
const {body} = require("express/lib/request");
const axios = require('axios');

const csv = require('csv-parser');
const fs = require('fs');


exports.getPersonDetails = async (req, res, next) => {};

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
    JOIN primaryprofession pr ON p.nconst = pr.nconst
    WHERE p.primaryName LIKE "${namePart}" `+ (limit ? ' LIMIT ?' : '');

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

