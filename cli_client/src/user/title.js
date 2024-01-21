const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function title(options) {
    const titleID = options.titleID
    const url = constructURL('/title/', titleID)
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