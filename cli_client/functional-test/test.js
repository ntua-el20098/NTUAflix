const shell = require('shelljs');

const expected_json_return_1 = {
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

        console.log(JSON.stringify(expected_json_return_1));
        let expected = JSON.stringify(expected_json_return_1).replace(/\s/g, '');

        console.log(output);
        console.log(expected);

        expect(output).toMatch(expected);
        done();
    });
  });


  const expected_json_return_2 = {
    titleObject: {
        titleID: "tt0034841",
        type: "short",
        originalTitle: "Hen Hop",
        titlePoster: "https://image.tmdb.org/t/p/{width_variable}/88EH2TVg6fGK7SnGXcfQ05MD2Rk.jpg",
        startYear: "1994",
        endYear: "",
        genres: [
            {
                genreTitle: "Animation"
            },
            {
                genreTitle: "Short"
            }
        ],
        titleAkas: [
            {
                akaTitle: "Hen Hop",
                regionAbbrev: ""
            },
            {
                akaTitle: "Hen Hop",
                regionAbbrev: "FR"
            },
            {
                akaTitle: "To pidima tis kotas",
                regionAbbrev: "GR"
            },
            {
                akaTitle: "Hen Hop",
                regionAbbrev: "CA"
            }
        ],
        principals: [
            {
                nameID: "nm0572235",
                name: "Norman McLaren",
                category: "director"
            }
        ],
        rating: {
            avRating: "6.3",
            nVotes: "282"
        }
    }
};

it('outputs valid JSON format', (done) => {
    jest.setTimeout(10000);
    shell.exec('se2326 title --titleID tt0034841', { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            console.error('Command execution failed:', stderr);
            // Handle error case appropriately
            done(); // Call done() to end the test
            return;
        }
        // Remove whitespaces from actual output
        let output  = stdout.replace(/\s/g, '');

        //console.log(JSON.stringify(expected_json_return_2));
        let expected = JSON.stringify(expected_json_return_2).replace(/\s/g, '');

        console.log(output);
        console.log(expected);

        expect(output).toMatch(expected);
        done();
    });
  });

  const  expected_json_return_3 = {
      status: 'OK',
      dataconnection: { host: 'localhost', user: 'root', database: 'tl' }
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
          // Remove whitespaces from actual output
          let output  = stdout.replace(/\s/g, '');
  
          //console.log(JSON.stringify(expected_json_return_2));
          let expected = JSON.stringify(expected_json_return_3).replace(/\s/g, '');
  
          console.log(output);
          console.log(expected);
  
          expect(output).toMatch(expected);
          done();
      });
    });  
  