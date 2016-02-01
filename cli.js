'use strict';

const npmDownloads = require('./src');
const minimist = require('minimist');
const version = require('./package.json').version;
const defaults = {
  boolean: [
    'help',
    'version',
    'last-day',
    'last-week',
    'last-month'
  ],
  alias: {
    h: 'help',
    v: 'version'
  }
};

const help = `
Usage: npm-downloads <MODULE> [OPTIONS]

  Get the downloads count from a given npm package from the Terminal

Example:
  $ npm-downloads jquery

Options:
  -v --version              Display current software version
  -h --help                 Display help and usage details
     --module               Module to search for the downloads count (or you can just pass it along as seen on the example)
`;

const run = argv => npmDownloads(argv);

// Must be ≠ 0 if any errors occur during execution
exports.exitCode = 0;

// Allow mocking the stdout/stderr
exports.stdout = process.stdout;
exports.stderr = process.stderr;

exports.parse = options => minimist(options, defaults);

exports.run = argv => {
  // Reset status code at each run
  exports.exitCode = 0;

  // Make sure module is exported as `module` on the options
  argv.module = argv.module || argv._.pop();

  if (argv.help) {
    exports.stderr.write(help);
    return;
  }

  if (argv.version) {
    exports.stderr.write(`npm-downloads v${version}\n`);
    return;
  }

  run(argv);
};
