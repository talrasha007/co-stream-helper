const _ = require('co-lodash');
const co = require('co');

module.exports = function (fn) {
  if (_.isGenerator(fn)) {
    return co.wrap(fn);
  } else {
    return function () {
      try {
        let ret = fn.apply(null, arguments);

        if (ret && ret.then) {
          return ret;
        } else {
          return {
            then: cb => cb(ret)
          }
        }
      } catch (e) {
        return {
          then: (cb, errCb) => errCb(e)
        }
      }
    }
  }
};