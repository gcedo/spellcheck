'use strict';
const readline      = require('readline');
const fs            = require('fs');
const getSuggestion = require('./lib/suggestions.js');

const dictionary = {};

const reader = readline.createInterface({
  input: fs.createReadStream('/usr/share/dict/words')
});

const cli = readline.createInterface(process.stdin, process.stdout);
cli.setPrompt('> ');

reader
.on('line', line => dictionary[line.toLowerCase()] = true)
.on('close', () => {
  cli.prompt();
  cli.on('line', line => {
    console.log(getSuggestion(line.trim(), dictionary));
    cli.prompt();
  })
  .on('close', () => {
    console.log('\nSee you later, alligator.');
    process.exit(0);
  });
});
