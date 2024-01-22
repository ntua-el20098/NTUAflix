const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');

module.exports = function title(options) {
    console.log(options.titlePart);
    options = {
        tqueryObject: {
            titlePart: options.titlePart
        }
    };

    const url = constructURL('/searchtitle' )
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
/*
async (cmd) => {
    const tqueryObject = {
        tqueryObject: {
            titlePart: cmd.titlePart
        }
    };
    const url = constructURL('/searchtitle', undefined, tqueryObject);
    try {
        const response = await axios.post(url, tqueryObject);
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }

 */