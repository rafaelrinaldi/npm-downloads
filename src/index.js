'use strict';

const Promise = require('pinkie-promise');
const table = require('text-table');
const chalk = require('chalk');
const grouper = require('number-grouper');
const fetchOptions = require('./options/fetch');
const api = require('./api')(fetchOptions);
const spinner = require('./spinner');

const printDownloadsCount = (module, downloads) => {
  const output = [
    'day',
    'week',
    'month'
  ].map((when, index) => {
    const count = grouper(downloads[index].downloads);
    return [
      `  Last ${when}`,
      ` ${chalk.cyan(count)}`
    ];
  });

  console.log(`\n  Downloads of the ${chalk.bold.green(module)} module on npm\n`);
  console.log(table(output, {align: ['r', 'l']}));
};

const fetchDownloadsCount = options => {
  return Promise.all([
    api.fetch(api.lastDay(options.module)),
    api.fetch(api.lastWeek(options.module)),
    api.fetch(api.lastMonth(options.module))
  ]);
};

const handleNonexistentPackage = (options, response) => {
  const isBadResponse = item => item.error;

  if (Array.isArray(response) && response.some(isBadResponse)) {
    console.log(`The package ${chalk.bold.red(options.module)} doesn't seem to exist`);
    return false;
  }

  return true;
};

const handleFetchError = error => {
  spinner.stop();

  if (error.code === 'ENOTFOUND') {
    console.log(`Looks like you have internet connection issues ☹`);
  } else if (error.code === 'ETIMEDOUT') {
    console.log(`Tried ${fetchOptions.retries} times but the request has timed out. Sorry ☹`);
  } else {
    console.log(error);
  }

  return process.exit(1);
};

const npmDownloads = options => {
  spinner.start(`Fetching ${chalk.bold.green(options.module)} downloads`);

  return fetchDownloadsCount(options)
    .then(response => {
      return response.map(item => item.body);
    })
    .then(response => {
      spinner.stop();

      if (handleNonexistentPackage(options, response)) {
        printDownloadsCount(options.module, response);
      }

      return response;
    })
    .catch(error => {
      return handleFetchError(error);
    });
};

module.exports = npmDownloads;
