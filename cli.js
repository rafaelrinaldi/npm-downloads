#!/usr/bin/env node

const npmDownloads = require('./')
const minimist = require('minimist')
const options = {
  boolean: ['help', 'version', 'json'],
  alias: {
    h: 'help',
    v: 'version'
  },
  default: {
    json: false
  }
}

const argv = minimist(process.argv.slice(2), options)

const help = `
Usage: npm-downloads <PACKAGE> [OPTIONS]

  Get download stats from any package published to npm

Example:
  $ npm-downloads jquery

Options:
  -v --version              Display current software version
  -h --help                 Display help and usage details
     --json                 Render output as JSON
`

function exitWithSuccess (message) {
  process.stdout.write(`${message}\n`)
  process.exit(0)
}

function exitWithError (message, code = 1) {
  process.stderr.write(`${message}\n`)
  process.exit(code)
}

if (argv.help || !argv._.length) exitWithSuccess(help)
if (argv.version) exitWithSuccess(require('./package.json').version)

const [packageName] = argv._

async function run ({ json }) {
  try {
    const output = await npmDownloads({ packageName, json })
    console.log(output)
  } catch ({ message, exitCode }) {
    console.error(message)
    process.exit(exitCode)
  }
}

run(argv)
