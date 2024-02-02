const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const chalk = require('chalk');
const axios = require('axios');
const json2csv = require('json2csv').parse;


module.exports = function(options) {
    let url = constructURL('/admin/', 'healthcheck');
    const format = options.format || 'json';
    console.log(url);
    let config = {
        method: 'POST',
        url: url,
        port: 9876,
    };
    if(format === 'json'){
        axios(config)
            .then(res => {
                console.log(res.data);
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