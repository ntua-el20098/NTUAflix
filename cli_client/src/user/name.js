const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports =function name(options) {
    const nameID = options.nameID
    const url = constructURL('/name/', nameID)
    const config = {
        method: 'GET',
        url: url,
        port: 9876,
    };
    axios(config)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            errorHandler(err);
        });
}