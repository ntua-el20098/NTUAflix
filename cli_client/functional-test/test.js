const shell = require('shelljs');

it('outputs valid JSON format', (done) => {
    shell.exec('se2321 title --titleID tt0099851', { silent: true }, (code, stdout, stderr) => {
      const output = JSON.parse(stdout);
      expect(output).toHaveProperty('titleObject');
      expect(output.titleObject).toHaveProperty('titleID', 'tt0099851');
      done();
    });
  });
