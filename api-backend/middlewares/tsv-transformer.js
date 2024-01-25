const fs = require('fs');
 
function modifyTSV_Names(inputFilePath, outputProfessionFilePath, outputTitlesFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8');
    const rows = data.split('\n');
 
    const profession = [];
    const titles = [];
 
    rows.forEach(row => {
        const columns = row.split('\t');
 
        // Ensure there are at least 6 columns
        if (columns.length >= 6) {
            const id = columns[0];
 
            // Check if column 4 (index 3) is not null, undefined, or an empty string
            if (columns[4] !== null && columns[4] !== undefined && columns[4].trim() !== '') {
                const professionArray = columns[4].split(',');
                
                professionArray.forEach(genre => {
                    profession.push(`${id}\t${genre.trim()}`);
                });
            }
 
            // Check if column 5 (index 4) is not null, undefined, or an empty string
            if (columns[5] !== null && columns[5] !== undefined && columns[5].trim() !== '') {
                const titlesArray = columns[5].split(',');
 
                titlesArray.forEach(title => {
                    titles.push(`${id}\t${title.trim()}`);
                });
            }
        }
    });
 
    const professionResult = profession.join('\n');
    fs.writeFileSync(outputProfessionFilePath, professionResult, 'utf8');
 
    const titlesResult = titles.join('\n');
    fs.writeFileSync(outputTitlesFilePath, titlesResult, 'utf8');
}
 
//const inputFilePath = 'C:/Users/daphn/Documents/πολυτεχνειο/Μαθήματα/7o εξάμηνο/ΤΛ/Εργασία/NtuaFlix/sample_data_softeng_project_2023_v2/truncated_data/truncated_name.basics.tsv';
//const outputProfessionFilePath = 'C:/Users/daphn/Documents/πολυτεχνειο/Μαθήματα/7o εξάμηνο/ΤΛ/Εργασία/Tests/output1.tsv';
//const outputTitlesFilePath = 'C:/Users/daphn/Documents/πολυτεχνειο/Μαθήματα/7o εξάμηνο/ΤΛ/Εργασία/Tests/output2.tsv';
 
//modifyTSV_Names(inputFilePath, outputProfessionFilePath, outputTitlesFilePath);
 
module.exports = {
    modifyTSV_Names
  };