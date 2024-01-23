const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function resetall() {
    const url = constructURL('/admin/resetall');
    const config = {
        method: 'POST',
        url: url,
        port: 9876,
    };
    axios(config)
        .then(res => {
            console.log(JSON.stringify(res.data, null, 2));
        })
        .catch(err => {
            errorHandler(err);
        });
}