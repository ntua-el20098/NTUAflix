const axios = require('axios');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const fs = require("fs");
const FormData = require("form-data");

module.exports = function newakas(options) {

    console.log(options.filename)

    const filepath = options.filename;

    // Create a stream to read the file
    const fileStream = fs.createReadStream(filepath);

    // Create a FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', fileStream);

    const url = constructURL('/admin/upload/titleakas' )
    const config = {
        method: 'POST',
        url: url,
        port: 9876,
        data : filepath
    };
    axios(config)
        .then(res => {
            console.log(JSON.stringify(res.data, null, 2));
        })
        .catch(err => {
            errorHandler(err);
        });
}