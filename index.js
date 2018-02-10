const hyperdrive = require('hyperdrive')

module.exports = function (key, opts) {
  return hyperdrive(__dirname, key, opts)
}
