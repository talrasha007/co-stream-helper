const co = require('co');
const Readable = require('stream').Readable;

class IterableStream extends Readable {
  constructor(iterable) {
    super({ objectMode: true });

    const me = this;
    co(function *() {
      for (let item of iterable) {
        if (item !== null && item !== undefined && !me.push(item))
          yield cb => me._resume = cb;
      }

      me.push(null);
    });
  }

  _read() {
    const resume = this._resume;
    if (resume) {
      this._resume = null;
      resume();
    }
  }
}

module.exports = IterableStream;