const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function title(options) {
    console.log(options.titlePart);
    options = {
        nqueryObject: {
            namePart: options.namePart
        }
    };

    const url = constructURL('/searchname' )
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
