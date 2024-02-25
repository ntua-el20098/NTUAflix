const shell = require('shelljs');

const expected_csv_1  = "nameObject";
const expected_csv_2 = '{""nameID"":""nm0000372"",""name"":""Amanda Donohoe"",""namePoster"":""https://image.tmdb.org/t/p/{width_variable}/f7s1GhnJMfGJEReVtMRQC6Tju5V.jpg"",""birthYr"":""1962"",""deathYr"":""0"",""profession"":""actress,producer"",""nameTitles"":[{""titleID"":""tt0099992"",""category"":""actress""}]}';

it('outputs valid JSON format', (done) => {
    jest.setTimeout(10000);
    shell.exec('se2326 name --nameid nm0000372 --format csv', { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
            console.error('Command execution failed:', stderr);
            // Handle error case appropriately
            done(); // Call done() to end the test
            return;
        }
        // Remove whitespaces from actual output
        const rows = stdout.trim().split('\n');

        expect(rows[0]).toMatch(expected_csv_1);
        expect(rows[1]).toMatch(expected_csv_2);

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

        //console.log(output);
        //console.log(expected);

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
  
          //console.log(output);
          //console.log(expected);
  
          expect(output).toMatch(expected);
          done();
      });
    });  
  
   const expected_csv_row_1 = "nameObject";
   const expected_csv_row_2 = '{""nameID"":""nm0000372"",""name"":""Amanda Donohoe"",""namePoster"":""https://image.tmdb.org/t/p/{width_variable}/f7s1GhnJMfGJEReVtMRQC6Tju5V.jpg"",""birthYr"":""1962"",""deathYr"":""0"",""profession"":""actress,producer"",""nameTitles"":[{""titleID"":""tt0099992"",""category"":""actress""}]}';
    
    
    it('outputs valid CSV format', (done) => {
        jest.setTimeout(10000);
        shell.exec('se2326 searchname --name Aman --format csv', { silent: true }, (code, stdout, stderr) => {
            if (code !== 0) {
                console.error('Command execution failed:', stderr);
                // Handle error case appropriately
                done(); // Call done() to end the test
                return;
            }
            // Remove whitespaces from actual output
            
            const rows = stdout.trim().split('\n');
    
            //console.log(output);
            //console.log(expected);
    
            expect(rows[0]).toMatch(expected_csv_row_1);
            expect(rows[1]).toMatch(expected_csv_row_2);
            done();
        });
      });  


      const expected_csv_row_3 = "titleObject";
      const expected_csv_row_4 = '{""titleID"":""tt0095571"",""type"":""short"",""originalTitle"":""The Making of Monsters"",""titlePoster"":""https://image.tmdb.org/t/p/{width_variable}/zgenzvJ09QuRaduURuBuQzmM4jy.jpg"",""startYear"":""1991"",""endYear"":"""",""genres"":[{""genreTitle"":""Short""}],""titleAkas"":[{""akaTitle"":""The Making of Monsters"",""regionAbbrev"":""CA""}],""principals"":[{""nameID"":""nm0026523"",""name"":""Christopher Anderson"",""category"":""actor""},{""nameID"":""nm0036732"",""name"":""Stewart Arnott"",""category"":""actor""},{""nameID"":""nm0340742"",""name"":""John Greyson"",""category"":""director, writer""},{""nameID"":""nm0417284"",""name"":""Miume Jan"",""category"":""editor""},{""nameID"":""nm0528508"",""name"":""Laurie Lynd"",""category"":""producer""},{""nameID"":""nm0532024"",""name"":""Lee MacDougall"",""category"":""actor""},{""nameID"":""nm0770765"",""name"":""Glenn Schellenberg"",""category"":""composer""}],""rating"":{""avRating"":""8.4"",""nVotes"":""41""}}';
      const expected_csv_row_5 = '{""titleID"":""tt0099006"",""type"":""short"",""originalTitle"":""The Air Globes"",""titlePoster"":"""",""startYear"":""1990"",""endYear"":"""",""genres"":[{""genreTitle"":""Short""}],""titleAkas"":[{""akaTitle"":""The Air Globes"",""regionAbbrev"":""US""},{""akaTitle"":""The Air Globes"",""regionAbbrev"":""""}],""principals"":[{""nameID"":""nm0136603"",""name"":""Patricia Cardoso"",""category"":""director""}],""rating"":{""avRating"":""8.4"",""nVotes"":""14""}}';
       
       
       it('outputs valid CSV format', (done) => {
           jest.setTimeout(10000);
           shell.exec('se2326 bygenre --genre Short --min 8.39 --format csv', { silent: true }, (code, stdout, stderr) => {
               if (code !== 0) {
                   console.error('Command execution failed:', stderr);
                   // Handle error case appropriately
                   done(); // Call done() to end the test
                   return;
               }
               // Remove whitespaces from actual output
               
               const rows = stdout.trim().split('\n');
       
               //console.log(output);
               //console.log(expected);
       
               expect(rows[0]).toMatch(expected_csv_row_3);
               expect(rows[1]).toMatch(expected_csv_row_4);
               expect(rows[2]).toMatch(expected_csv_row_5);
               done();
           });
         });  