const through = require('through');

module.exports = function (iterator) {
  return through(iterator);
};