const shell = require('shelljs');

const expected_json_return = {
    nameObject: {
        nameID: "nm0000019",
        name: "Federico Fellini",
        namePoster: "https://image.tmdb.org/t/p/{width_variable}/jH2VnHAuI0UbTWsnrjMPro0fC9j.jpg",
        birthYr: 1920,
        deathYr: 1993,
        profession: "actor,director,writer",
        nameTitles: [
            {
                titleID: "tt0098606",
                category: "director"
            }
        ]
    }

};

it('outputs valid JSON format', (done) => {
    jest.setTimeout(10000);
    shell.exec('se2326 name --nameID nm0000019', { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            console.error('Command execution failed:', stderr);
            // Handle error case appropriately
            done(); // Call done() to end the test
            return;
        }
        // Remove whitespaces from actual output
        let output  = stdout.replace(/\s/g, '');

        console.log(JSON.stringify(expected_json_return));
        let expected = JSON.stringify(expected_json_return).replace(/\s/g, '');

        expect(output).toMatch(expected);
        done();
    });
  });
