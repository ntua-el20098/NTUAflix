const axios = require('axios');
const json2csv = require('json2csv').parse;
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function searchname(options) {
    console.log(options.namePart);
    const format = options.format || 'json';
    options = {
        nqueryObject: {
            namePart: options.namePart
        }
    };
    const url = constructURL('/searchname');
    const config = {
        method: 'GET',
        url: url,
        port: 9876,
        data : options
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
}
