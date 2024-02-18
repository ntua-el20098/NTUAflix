const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const chalk = require('chalk');
const axios = require('axios');
const json2csv = require('json2csv').parse;
const https = require('https');


module.exports = function(options) {
    let url = constructURL('/admin/', 'healthcheck');
    const format = options.format || 'json';
    let config = {
        method: 'POST',
        url: url,
        port: 9876,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    };
    if(format === 'json'){
        axios(config)
            .then(res => {
                console.log(JSON.stringify(res.data, null, 2));
            })
            .catch(err => {
                errorHandler(err);
            })
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
        console.error('Invalid Format');
        process.exit(1);
    }
}