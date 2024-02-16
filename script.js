// Purpose: Script to run all commands in the project
const fs = require("fs");
const { exec } = require("child_process");

        const commands = [
          "se2326 healthcheck",
          "se2326 resetall",
          'se2326 newtitles --filename "truncated_data/truncated_title.basics.tsv"',
          'se2326 newnames --filename "truncated_data/truncated_name.basics.tsv"',
          'se2326 newratings --filename "truncated_data/truncated_title.ratings.tsv"',
          'se2326 newcrew --filename "truncated_data/truncated_title.crew.tsv"',
          'se2326 newepisode --filename "truncated_data/truncated_title.episode.tsv"',
          'se2326 newprincipals --filename "truncated_data/truncated_title.principals.tsv"',
          'se2326 newakas --filename "truncated_data/truncated_title.akas.tsv"'
        ];

        // Execute each command independently
        function execPromise(command) {
          return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.warn(error);
                reject(error);
              }
              resolve(stdout? stdout : stderr);
            });
          });
        }
        
        async function runCommands() {
          for (let i = 0; i < commands.length; i++) {
            try {
              const stdout = await execPromise(commands[i]);
              console.log(`Command ${i + 1} executed successfully:\n${stdout}`);
            } catch (error) {
              console.error(`Error running command ${i + 1}: ${error.message}`);
            }
          }
        }
        
        runCommands();