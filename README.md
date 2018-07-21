# npm-downloads [![Build Status](https://semaphoreci.com/api/v1/projects/2a033503-58f0-4d08-ba32-f883ad912067/680199/badge.svg)](https://semaphoreci.com/rafaelrinaldi/npm-downloads)

> Get the downloads count from a given npm package from the Terminal

![demo](./demo.gif)

## Install

```sh
$ npm install @rafaelrinaldi/npm-downloads -g
```

## Usage

```sh
Usage: npm-downloads <MODULE> [OPTIONS]

  Get the downloads count from a given npm package from the Terminal

Example:
  $ npm-downloads jquery

Options:
  -v --version              Display current software version
  -h --help                 Display help and usage details
     --module               Module to search for the downloads count (or you can just pass it along as seen on the example)
```

## Known issues

* Currently the npm API doesn't return download stats for private packages, even tho they're published as public

## License

MIT :copyright: [Rafael Rinaldi](http://rinaldi.io)

---

<p align="center">
  <a href="https://buymeacoff.ee/rinaldi" title="Buy me a coffee">Buy me a ☕</a>
</p>
