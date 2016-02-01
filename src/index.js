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

const isNonexistentPackage = response => {
  return Array.isArray(response) && response.some(item => item.error);
};

const logError = error => {
  spinner.stop();

  if (error.code === 'ENOTFOUND') {
    error.message = `Looks like you have internet connection issues`;
  } else if (error.code === 'ETIMEDOUT') {
    error.message = `Tried ${fetchOptions.retries} times but the request has timed out`;
  } else if (error.message === 'nonexistent package') {
    console.log(`Package doesn't seem to exist`);
  } else if (error.message === 'module name required') {
    console.log(`Specify a module name`);
  }

  return error;
};

const npmDownloads = options => {
  if (!options.module || typeof options.module !== 'string') {
    return Promise.reject(new Error('module name required'));
  }

  spinner.start(`Fetching ${chalk.bold.green(options.module)} downloads`);

  return fetchDownloadsCount(options)
    .then(response => {
      return response.map(item => item.body);
    })
    .then(response => {
      spinner.stop();

      if (isNonexistentPackage(response)) {
        return Promise.reject(new Error('nonexistent package'));
      }

      printDownloadsCount(options.module, response);

      return response;
    });
};

module.exports = options => {
  return npmDownloads(options).catch(error => {
    throw logError(error);
  });
};
