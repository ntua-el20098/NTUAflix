const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const chalk = require('chalk');
const axios = require('axios');

module.exports = function(options) {
    let url = constructURL('/admin/', 'healthcheck');
    console.log(url);
    let config = {
        method: 'POST',
        url: url,
        port: 9876,
    };
    axios(config)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            errorHandler(err);
        })
}