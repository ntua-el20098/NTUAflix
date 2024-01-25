const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function bygenre(options) {
    if (!options.genre || !options.min) {
        console.error('Both --genre and --min are required.');
        process.exit(1);
    }
    console.log(options.genre);
    console.log(options.min);
    options = {
        gqueryObject: {
            qgenre: options.genre,
            minrating: options.min
        }
    };

    const url = constructURL('/bygenre' )
    const config = {
        method: 'GET',
        url: url,
        port: 9876,
        data : options
    };
    axios(config)
        .then(res => {
            console.log(JSON.stringify(res.data, null, 2));
        })
        .catch(err => {
            errorHandler(err);
        });
}
