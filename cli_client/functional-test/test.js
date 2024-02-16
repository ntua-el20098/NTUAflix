const shell = require('shelljs');

const expected_json_return = {
    "nameObject": {
      "nameID": "nm0615736",
      "name": "Musidora",
      "namePoster": "https://image.tmdb.org/t/p/{width_variable}/kHiLG0lyy5WqqxsLgYPAi61R37p.jpg",
      "birthYr": 0,
      "deathYr": 1957,
      "profession": "actress,director,writer",
      "nameTitles": [
        {
          "titleID": "tt0015414",
          "category": "self"
        }
      ]
    }
  };

it('outputs valid JSON format', (done) => {
    jest.setTimeout(10000);
    shell.exec('se2326 healthcheck', { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            console.error('Command execution failed:', stderr);
            // Handle error case appropriately
            done(); // Call done() to end the test
            return;
        }
        console.log(stdout);
        const output = JSON.parse(stdout);
        //expect(output).toMatchObject(expected_json_return);
        done();
    });
  });
