const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const constructURL = require('../../lib/constructURL');
const errorHandler = require('../../lib/errorHandler');
const json2csv = require('json2csv').parse;

module.exports = function newtitles(options) {
    console.log(options.filename)
    const format = options.format || 'json';
    const filepath = options.filename;

    // Create a stream to read the file
    const fileStream = fs.createReadStream(filepath);

    // Create a FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append('file', fileStream);

    const url = constructURL('/admin/' , 'upload/titlebasics' )
    const config = {
        method: 'POST',
        url: url,
        port: 9876,
        data: formData, // Pass the FormData object as the data property
        headers: formData.getHeaders() // Include the headers generated by FormData
    };
    if(format === 'json'){
        axios(config)
            .then(res => {
                console.log(JSON.stringify(res.data, null, 2));
            })
            .catch(err => {
                errorHandler(err);
            });
    }
    else if(format === 'csv'){
        axios(config)
        .then(res => {
            const csvdata = json2csv(res.data);
            console.log(csvdata);
        })
        .catch(err => {
            errorHandler(err);
        }); 
    }
    else{
        console.error('Invalid Format');
        process.exit(1);
    }
}