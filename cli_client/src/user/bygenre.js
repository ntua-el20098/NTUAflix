const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const json2csv = require('json2csv').parse;

module.exports = function bygenre(options) {
    const genre = options.genre
    const minRating = options.min
    const fromYear = options.from
    const toYear = options.to
    const format = options.format || 'json';
    if (!genre || !minRating) {
        console.error('Both --genre and --min are required.');
        process.exit(1);
    }
    const url = constructURL('/bygenre')
    options = {
        gqueryObject: {
            qgenre: genre,
            minrating: minRating,
            yrFrom: fromYear, //optional
            yrTo: toYear//optional
        }
    };
    const config = {
        method: 'GET',
        url: url,
        port: 9876,
        data: options
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