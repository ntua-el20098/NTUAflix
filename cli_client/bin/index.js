#! /usr/bin/env node

const commands = require("commander");
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');

//Endpoints
const healthcheck = require('../src/admin/healthcheck');
const resetall = require('../src/admin/resetall');
const newtitle = require('../src/admin/newtitle');
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

console.log(
    chalk.yellow(
        figlet.textSync('BitsPlease', {horizontalLayout: 'full'})
    )
)

// healthcheck
commands.command('healthcheck')
    .alias('hc')
    .description('Confirms end-to-end connectivity between the user and the database')
    .action( function(options) { healthcheck(options) } )

// resetall
commands.command('resetall')
    .alias('rsall')
    .description('Deletes all data from the database')
    .action( function(options) { resetall(options) } )

// newtitle
commands.command('newtitle')
    .alias('nt')
    .description('Adds a new title to the database')
    .action( function(options) { newtitle(options) } )

// newakas
commands.command('newakas')
    .alias('na')
    .description('Adds a new alternate title to the database')
    .action( function(options) { newakas(options) } )
// newnames
commands.command('newnames')
    .alias('nn')
    .description('Adds a new name to the database')
    .action( function(options) { newnames(options) } )

// newcrew
commands.command('newcrew')
    .alias('nc')
    .description('Adds a new crew member to the database')
    .action( function(options) { newcrew(options) } )

// newepisode
commands.command('newepisode')
    .alias('ne')
    .description('Adds a new episode to the database')
    .action( function(options) { newepisode(options) } )

// newprincipals
commands.command('newprincipals')
    .alias('s')
    .description('Adds a new principal to the database')
    .action( function(options) { newprincipals(options) } )

// newratings
commands.command('newratings')
    .alias('nr')
    .description('Adds a new rating to the database')
    .action( function(options) { newratings(options) } )

// title
commands.command('title')
    .alias('t')
    .description('Returns the title with the specified tconst')
    .option('-tid, --tconst <tconst>', 'tconst of the title')
    .action( function(options) { title(options) } )


// searchtitle
commands.command('searchtitle')
    .alias('st')
    .description('Returns the title with the specified primaryTitle')
    .action( function(options) { searchtitle(options) } )

// bygenre
commands.command('bygenre')
    .alias('bg')
    .description('Returns the titles with the specified genre')
    .action( function(options) { bygenre(options) } )

// name
commands.command('name')
    .alias('n')
    .description('Returns the name with the specified nconst')
    .action( function(options) { name(options) } )

// searchname
commands.command('searchname')
    .alias('sn')
    .description('Returns the name with the specified primaryName')
    .action( function(options) { searchname(options) } )

let scope = process.argv[2];
let scopeList = ['healthcheck', 'hc', 'resetall', 'rsall',
    'newtitle', 'nt', 'newakas', 'na', 'newnames', 'nn', 'newcrew', 'nc',
    'newepisode', 'ne', 'newprincipals', 's', 'newratings', 'nr',
    'title', 't', 'searchtitle', 'st', 'bygenre', 'bg', 'name', 'n', 'searchname', 'sn'];

if (process.argv.length < 2) {
    console.log(process.argv.length < 3);
    console.log(chalk.red('Error occured! Scope was not specified!'));
    console.log(chalk.yellow('Choose one of the following:'));
    console.log(chalk.yellow('healthcheck | hc'));
    console.log(chalk.yellow('resetall | rsall'));
    console.log(chalk.yellow('newtitle | nt'));
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