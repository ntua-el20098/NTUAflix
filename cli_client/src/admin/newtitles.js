const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function newtitles(options) {

    const filepath = options.filename;

    const url = constructURL('/admin/upload/titlebasics' )
    const config = {
        method: 'POST',
        url: url,
        port: 9876,
        data : {filepath}
    };
    axios(config)
        .then(res => {
            console.log(JSON.stringify(res.data, null, 2));
        })
        .catch(err => {
            errorHandler(err);
        });
}