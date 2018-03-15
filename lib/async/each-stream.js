const _ = require('co-lodash');
const co = require('co');
const Writable = require('stream').Writable;
const wrap = require('../wrap');

class EachStream extends Writable {
  constructor(iterator, opt) {
    super(opt);

    this._iterator = wrap(iterator);
    this._opt = _.defaults(opt || {}, { parallel: 1 });
    this._cnt = 0;
  }

  _write(data, encoding, done) {
    if (this._err) return done(this._err);

    const parallel = this._opt.parallel;

    if (!this._opt.objectMode && this._opt.encoding && Buffer.isBuffer(data)) data = data.toString(this._opt.encoding);

    this._iterator(data).then(() => {
      this._cnt--;

      if (this._wait && this._cnt < parallel) {
        process.nextTick(this._wait);
        this._wait = null;
      }
    }, err => {
      this._err = err;
      this._cnt--;

      if (this._wait && this._cnt < parallel) {
        process.nextTick(this._wait);
        this._wait = null;
      }
    });

    if (++this._cnt < parallel) done();
    else if (!this._wait) this._wait = done;
    else console.error('co-stream/each-stream: This should not happen.');
  }

  _final(done) {
    const me = this;
    co(function *() {
      while (me._cnt > 0) yield _.sleep(1);
      done(me._err);
    });
  }
}

module.exports = (iterator, opt) => new EachStream(iterator, opt);