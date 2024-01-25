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

            if (columns[4] !== null && columns[4] !== undefined && columns[4].trim() !== '') {
                const professionArray = columns[4].split(',');
                
                professionArray.forEach(profession => {
                    profession.push(`${id}\t${profession.trim()}`);
                });
            }

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

function modifyTSV_Crew(inputFilePath, outputDirectorsFilePath, outputWritersFilePath) {
    const data = fs.readFileSync(inputFilePath, 'utf8');
    const rows = data.split('\n');

    const directors = [];
    const writers = [];

    rows.forEach(row => {
        const columns = row.split('\t');

        if (columns.length >= 3) {
            const id = columns[0];

            if (columns[1] !== null && columns[1] !== undefined && columns[1].trim() !== '') {
                const directorsArray = columns[1].split(',');
                
                directorsArray.forEach(director => {
                    directors.push(`${id}\t${director.trim()}`);
                });
            }

            if (columns[2] !== null && columns[2] !== undefined && columns[2].trim() !== '') {
                const writersArray = columns[2].split(',');

                writersArray.forEach(writer => {
                    writers.push(`${id}\t${writer.trim()}`);
                });
            }
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