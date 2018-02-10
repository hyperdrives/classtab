'use strict'

const hyperdrive = require('hyperdrive')
const storage = require('random-access-http')

const GITHUB_PREFIX = 'https://github.com/hyperdrives/classtab/raw/master'

function createDrive(key, opts) {
  return hyperdrive(onstorage, key, opts)
  function onstorage(filename) {
    return storage(prefix(filename))
  }

  function prefix(filename) {
    return GITHUB_PREFIX+'/'+filename
  }
}

module.exports = Object.assign(createDrive, { GITHUB_PREFIX })

