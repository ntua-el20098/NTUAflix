const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const chalk = require('chalk');
const axios = require('axios');

module.exports = function(options) {
    var url = constructURL('/admin/', 'healthcheck');
    console.log(url);
    var config = {
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
        })
}