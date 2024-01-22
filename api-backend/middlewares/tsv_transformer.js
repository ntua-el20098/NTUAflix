const fs = require('fs');

function modifyTSV(inputFilePath, outputFilePath) {
  // Read the TSV file
  const data = fs.readFileSync(inputFilePath, 'utf8');

  // Split the data into rows
  const rows = data.split('\n');

  // Process each row
  const modifiedRows = rows.map(row => {
    // Split the row into columns
    const columns = row.split('\t');

    // Check if genres column exists (index 8)
    if (!columns.length) {
      // Split genres into an array
      const genres = columns[8].split(',');

      // Create a new row for each genre
      const genreRows = genres.map(genre => {
        // Clone the columns
        const newColumns = [...columns];

        // Update the genre column
        newColumns[8] = genre.trim();

        // Join columns back into a tab-separated string
        return newColumns.join('\t');
      });

      // Join the rows for each genre
      return genreRows.join('\n');
    } else {
      // If the row doesn't have enough columns, return the original row
      return row;
    }
  });

  // Join all modified rows
  const result = modifiedRows.join('\n');

  // Write the result to a new TSV file
  fs.writeFileSync(outputFilePath, result, 'utf8');
}

// Example usage
// const inputFilePath = '/Users/charalamposk/Desktop/Software Engineering/truncated_data/truncated_title.basics.tsv';
// const outputFilePath = '/Users/charalamposk/Desktop/Software Engineering/truncated_data/truncated_title.basics2.tsv';

//modifyTSV(inputFilePath, outputFilePath);

module.exports = {
  modifyTSV
};