const axios = require('axios');
const json2csv = require('json2csv').parse;
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const https = require('https');
const chalk = require('chalk');

module.exports = function searchname(options) {
    const format = options.format || 'json';
    options = {
        nqueryObject: {
            namePart: options.name
        }
    };
    const url = constructURL('/searchname');
    const config = {
        method: 'GET',
        url: url,
        port: 9876,
        data : options,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    };
    if(format === 'json'){
        axios(config)
            .then(res => {
                console.log(chalk.green(JSON.stringify(res.data, null, 2)));
            })
            .catch(err => {
                errorHandler(err);
            });
    }
    else if(format === 'csv'){
        axios(config)
        .then(res => {
            const csvdata = json2csv(res.data);
            console.log(chalk.green(csvdata));
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
