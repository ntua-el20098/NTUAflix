const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const json2csv = require('json2csv').parse;

module.exports = function resetall() {
    const format = options.format || 'json';
    const url = constructURL('/admin/resetall');
    const config = {
        method: 'POST',
        url: url,
        port: 9876,
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
        console.error('Invalid Format');
        process.exit(1);
    }
}