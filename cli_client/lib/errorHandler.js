const fs = require('fs');
const chalk = require('chalk');

module.exports = function (err, customMessage) {

    let serverStatus = err.message.split(' ').slice(0,2).join(' ');
    if (serverStatus == 'connect ECONNREFUSED') {
        console.log(chalk.red("Sorry the server is facing some problems right now.\nPlease try again later!"));
        return;
    }

    let errMessage;
    if (err.response && err.response.data) {
        errMessage = err.response.data.message;
    } else {
        errMessage = 'An error occurred, but no additional details were provided.';
    }

    if (errMessage == 'Invalid Token.') {

        fs.unlink('../cli-client/softeng23bAPI.token', (err) => {
            if (err) throw err;
            console.log(chalk.green('User need to relog!'));
        })

    }

    (customMessage === undefined) ? console.log(chalk.red(errMessage)) : console.log(chalk.red(errMessage + '\n' + customMessage))

}