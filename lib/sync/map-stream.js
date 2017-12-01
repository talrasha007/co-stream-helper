const through = require('through');

module.exports = function (iterator, opt) {
  if (opt.isFilter) {
    return through(function (data) {
      if (data !== null && data !== undefined && iterator(data)) this.queue(data);
    });
  } else if (opt.flatten) {
    return through(function (data) {
      iterator(data).forEach(item => item !== null && item !== undefined && this.queue(item));
    });
  } else {
    return through(function (data) {
      const mapped = iterator(data);
      if (mapped !== null && mapped !== undefined) this.queue(mapped);
    });
  }
};
