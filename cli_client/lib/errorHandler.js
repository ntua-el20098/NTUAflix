const fs = require('fs');
const chalk = require('chalk');

module.exports = function (err) {

    let serverStatus = err.message.split(' ').slice(0, 2).join(' ');
    if (serverStatus === 'read ECONNRESET ') {
        console.log(chalk.red("Sorry the server is facing some problems right now.\nPlease try again later!"));
        return;
    }

    let errMessage;
    let status;
    if (err.response && err.response.data) {
        errMessage = err.response.data.message;
        status = err.response.status;
    } else {
        errMessage = 'An error occurred, but no additional details were provided.';
    }

    console.log('Status code :', chalk.bold.yellow(status),'\n', chalk.red(errMessage));
}