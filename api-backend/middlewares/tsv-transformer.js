const fs = require('fs');
 
function modifyTSV_Names(inputFilePath, outputProfessionFilePath, outputTitlesFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8');
    const rows = data.split('\n');
 
    const profession = [];
    const titles = [];
 
    rows.forEach(row => {
        const columns = row.split('\t');
 
        if (columns.length >= 6) {
            const id = columns[0];
 
            const professionArray = columns[4].split(',');
                
            professionArray.forEach(genre => {
                profession.push(`${id}\t${genre.trim()}`);
            });
 
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
 
function modifyTSV_Crew(inputFilePath, outputDirectorsFilePath, outputWritersFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8');
    const rows = data.split('\n');
 
    const directors = [];
    const writers = [];
 
    rows.forEach(row => {
        const columns = row.split('\t');
 
        if (columns.length >= 3) {
            const id = columns[0];
 
            const directorsArray = columns[1].split(',');
                
            directorsArray.forEach(director => {
                directors.push(`${id}\t${director.trim()}`);
            });
 
            const writersArray = columns[2].split(',');
 
            writersArray.forEach(writer => {
                writers.push(`${id}\t${writer.trim()}`);
            });
        }
    });
 
    const directorsResult = directors.join('\n');
    fs.writeFileSync(outputDirectorsFilePath, directorsResult, 'utf8');
 
    const writersResult = writers.join('\n');
    fs.writeFileSync(outputWritersFilePath, writersResult, 'utf8');
}
 
module.exports = {
    modifyTSV_Names, modifyTSV_Crew
  };