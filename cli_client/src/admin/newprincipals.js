const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const fs = require("fs");
const FormData = require("form-data");
const json2csv = require('json2csv').parse;
const https = require('https');
const chalk = require('chalk');

module.exports = function newprincipals(options) {

    console.log(options.filename)
    const format = options.format || 'json';
    const filepath = options.filename;

    // Create a stream to read the file
    const fileStream = fs.createReadStream(filepath);

    // Create a FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', fileStream);

    const url = constructURL('/admin/', 'upload/titleprincipals' )
    const config = {
        method: 'POST',
        url: url,
        port: 9876,
        data : formData,
        headers : formData.getHeaders(), // Include the headers generated by FormData
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    };
    if(format === 'json'){
        axios(config)
            .then(res => {
                console.log(JSON.stringify(res.data, null, 2));
            })
            .catch(err => {
                errorHandler(err);
            });
    }
    else if(format === 'csv'){
        axios(config)
        .then(res => {
            const csvdata = json2csv(res.data);
            console.log(csvdata);
        })
        .catch(err => {
            errorHandler(err);
        });  
    }
    else{
        console.error(chalk.red('Invalid Format! Valid options : json, csv.'));
        process.exit(1);
    }
}