const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function bygenre(options) {
    const genre = options.genre
    const minRating = options.min
    const fromYear = options.from
    const toYear = options.to
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
    axios(config)
        .then(res => {
            console.log(JSON.stringify(res.data, null, 2));
        })
        .catch(err => {
            errorHandler(err);
        });
}