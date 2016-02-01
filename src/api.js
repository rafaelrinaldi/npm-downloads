'use strict';

const got = require('got');
const api = options => {
  return {
    url: 'https://api.npmjs.org',
    service: 'downloads/point',

    fetch: url => got(url, options),

    base() {
      return `${this.url}/${this.service}`;
    },

    period(period, module) {
      return `${this.base()}/${period}/${module}`;
    },

    lastDay(module) {
      return this.period('last-day', module);
    },

    lastWeek(module) {
      return this.period('last-week', module);
    },

    lastMonth(module) {
      return this.period('last-month', module);
    }
  };
};

module.exports = api;
