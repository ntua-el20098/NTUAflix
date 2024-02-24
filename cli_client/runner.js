const fs = require("fs");
const { exec } = require("child_process");

const commands = [
    'se2326 healthcheck',
    'se2326 resetall',
    'se2326 newtitles --filename "../truncated_data/truncated_title.basics.tsv"',
    'se2326 newnames --filename "../truncated_data/truncated_name.basics.tsv"',
    'se2326 newratings --filename "../truncated_data/truncated_title.ratings.tsv"',
    'se2326 newcrew --filename "../truncated_data/truncated_title.crew.tsv"',
    'se2326 newepisode --filename "../truncated_data/truncated_title.episode.tsv"',
    'se2326 newprincipals --filename "../truncated_data/truncated_title.principals.tsv"',
    'se2326 newakas --filename "../truncated_data/truncated_title.akas.tsv"',
    'se2326 title --titleID tt0078006',
    'se2326 searchtitle --title "Hen"',
    'se2326 bygenre --genre "Drama" --min 1',
    'se2326 name --nameid nm0000019',
    'se2326 searchname --name "Fed"',
];

// Execute each command independently with a delay
function execPromise(command, delayTime) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

async function runCommands() {
    const delayBetweenCommands = 5000; // 5 seconds

    for (let i = 0; i < commands.length; i++) {
        try {
            const stdout = await execPromise(commands[i]);
            console.log(`Command ${i + 1} executed successfully:\n${stdout}`);

            if (i < commands.length - 1) {
                // Introduce delay between commands
                console.log(`Waiting for ${delayBetweenCommands / 1000} seconds before the next command...`);
                await new Promise(resolve => setTimeout(resolve, delayBetweenCommands));
            }
        } catch (error) {
            console.error(`Error running command ${i + 1}: ${error.message}`);
        }
    }
}

runCommands();
