#! /usr/bin/env node

const {Command} = require("commander");
const program = new Command();

const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

//Endpoints
const healthcheck = require('../src/admin/healthcheck');
const resetall = require('../src/admin/resetall');
const newtitles = require('../src/admin/newtitles');
const newakas = require('../src/admin/newakas');
const newnames = require('../src/admin/newnames');
const newcrew = require('../src/admin/newcrew');
const newepisode = require('../src/admin/newepisode');
const newprincipals = require('../src/admin/newprincipals');
const newratings = require('../src/admin/newratings');
const title = require('../src/user/title');
const searchtitle = require('../src/user/searchtitle');
const bygenre = require('../src/user/bygenre');
const name = require('../src/user/name');
const searchname = require('../src/user/searchname');

clear();
/*
console.log(
    chalk.yellow(
        figlet.textSync('BitsPlease', {horizontalLayout: 'full'})
    )
)
*/

// healthcheck
program
    .command('healthcheck')
    .alias('hc')
    .description('Confirms end-to-end connectivity between the user and the database')
    .option('--format <format>', 'format of the response')
    .action( function(options) { healthcheck(options) } )

// title
program
    .command('title')
    .alias('t')
    .description('Returns the title with the specified tconst')
    .option('-tid, --titleID <tconst>', 'tconst of the title')
    .option('--format <format>', 'format of the response')
    .action(function (options) { title(options) } )

// searchtitle
program
    .command('searchtitle')
    .alias('st')
    .description('Returns the title with the specified primaryTitle')
    .option('-tp, --titlePart <primaryTitle>', 'primaryTitle of the title')
    .option('--format <format>', 'format of the response')
    .action( function(options) { searchtitle(options) } )

// bygenre
program
    .command('bygenre')
    .alias('bg')
    .description('Returns the titles with the specified genre')
    .option('-g, --genre <genre>', 'Genre of the title')
    .option('-m, --min <minrating>', 'Minimum year of the title')
    .option('-f, --from <fromYear>', 'From year of the title')
    .option('-t, --to <toYear>', 'To year of the title')
    .option('--format <format>', 'format of the response')
    .action( function(options) { bygenre(options) } )

// name
program
    .command('name')
    .alias('n')
    .description('Returns the name with the specified nconst')
    .option('-nid, --nameID <nconst>', 'nconst of the name')
    .option('--format <format>', 'format of the response')
    .action( function(options) { name(options) } )

// search name
program
    .command('searchname')
    .alias('sn')
    .description('Returns the name with the specified primaryName')
    .option('-np, --namePart <primaryName>', 'primaryName of the name')
    .option('--format <format>', 'format of the response')
    .action( function(options) { searchname(options); } )


// resetall
program
    .command('resetall')
    .alias('rsall')
    .description('Deletes all data from the database')
    .option('--format <format>', 'format of the response')
    .action( function(options) { resetall(options) } )

// newtitles
program
    .command('newtitles')
    .alias('nt')
    .description('Adds a new title to the database')
    .option('-f, --filename <file>', 'path to the file')
    .option('--format <format>', 'format of the response')
    .action( function(options) { newtitles(options) } )

// newakas
program
    .command('newakas')
    .alias('na')
    .description('Adds a new alternate title to the database')
    .option('-f, --filename <file>', 'path to the file')
    .option('--format <format>', 'format of the response')
    .action( function(options) { newakas(options) } )
// newnames
program
    .command('newnames')
    .alias('nn')
    .description('Adds a new name to the database')
    .option('-f, --filename <file>', 'path to the file')
    .option('--format <format>', 'format of the response')
    .action( function(options) { newnames(options) } )

// newcrew
program
    .command('newcrew')
    .alias('nc')
    .description('Adds a new crew member to the database')
    .option('-f, --filename <file>', 'path to the file')
    .option('--format <format>', 'format of the response')
    .action( function(options) { newcrew(options) } )

// newepisode
program
    .command('newepisode')
    .alias('ne')
    .description('Adds a new episode to the database')
    .option('-f, --filename <file>', 'path to the file')
    .option('--format <format>', 'format of the response')
    .action( function(options) { newepisode(options) } )

// newprincipals
program
    .command('newprincipals')
    .alias('s')
    .description('Adds a new principal to the database')
    .option('-f, --filename <file>', 'path to the file')
    .option('--format <format>', 'format of the response')
    .action( function(options) { newprincipals(options) } )

// newratings
program
    .command('newratings')
    .alias('nr')
    .description('Adds a new rating to the database')
    .option('-f, --filename <file>', 'path to the file')
    .requiredOption('-f, --filename <file>', 'path to the file')
    .option('--format <format>', 'format of the response')
    .action( function(options) { newratings(options) } )

program
    .command('help')
    .description('Shows help')
    .action( () => { program.help() } )
program.parse(process.argv)

let scope = process.argv[2];
let scopeList = ['healthcheck', 'hc', 'resetall', 'rsall',
    'newtitles', 'nt', 'newakas', 'na', 'newnames', 'nn', 'newcrew', 'nc',
    'newepisode', 'ne', 'newprincipals', 's', 'newratings', 'nr',
    'title', 't', 'searchtitle', 'st', 'bygenre', 'bg', 'name', 'n', 'searchname', 'sn'];

if (process.argv.length < 2) {
    console.log(chalk.red('Error occured! Scope was not specified!'));
    console.log(chalk.yellow('Choose one of the following:'));
    console.log(chalk.yellow('healthcheck | hc'));
    console.log(chalk.yellow('resetall | rsall'));
    console.log(chalk.yellow('newtitles | nt'));
    console.log(chalk.yellow('newakas | na'));
    console.log(chalk.yellow('newnames | nn'));
    console.log(chalk.yellow('newcrew  | nc'));
    console.log(chalk.yellow('newepisode | ne'));
    console.log(chalk.yellow('newprincipals | s'));
    console.log(chalk.yellow('newratings | nr'));
    console.log(chalk.yellow('title | t'));
    console.log(chalk.yellow('searchtitle | st'));
    console.log(chalk.yellow('bygenre | bg'));
    console.log(chalk.yellow('name | n'));
    console.log(chalk.yellow('searchname | sn'));
}
else if (!scopeList.includes(scope)) {
    console.log(chalk.red('Error, this command does not exist!'));
    console.log(chalk.yellow('For more information, type --help'));
}