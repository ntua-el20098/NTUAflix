const fs = require('fs');
const uploadFile = require('../upload');

async function processUploadedFile(req, res) {
    try {
        const inputFilePath = req.file.path;
        const outputProfessionFilePath = __dirname + '/../uploads/output1.tsv';
        const outputTitlesFilePath = __dirname + '/../uploads/output2.tsv';

        modifyTSV_Names(inputFilePath, outputProfessionFilePath, outputTitlesFilePath);

        res.status(200).send("File processed successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

function modifyTSV_Names(inputFilePath, outputProfessionFilePath, outputTitlesFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8');
    const rows = data.split('\n');

    const profession = [];
    const titles = [];

    rows.forEach(row => {
        const columns = row.split('\t');

        const id = columns[0];
        if (columns[4] !== null && columns[4] !== undefined && columns[4].trim() !== '') {
            const professionArray = columns[4].split(',');
            
            professionArray.forEach(genre => {
                profession.push(`${id}\t${genre.trim()}`);
            });
        }

        if (columns[5] !== null && columns[5] !== undefined && columns[5].trim() !== '') {
            const titlesArray = columns[5].split(',');

            titlesArray.forEach(title => {
                titles.push(`${id}\t${title.trim()}`);
            });
        }
    });

    const professionResult = profession.join('\n');
    fs.writeFileSync(outputProfessionFilePath, professionResult, 'utf8');

    const titlesResult = titles.join('\n');
    fs.writeFileSync(outputTitlesFilePath, titlesResult, 'utf8');
}

module.exports = { processUploadedFile };
