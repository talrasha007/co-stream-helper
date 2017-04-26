const _ = require('co-lodash');
const co = require('co');
const Transform = require('stream').Transform;
const wrap = require('./wrap');

class MapStream extends Transform {
  constructor(mapper, opt) {
    super(opt);

    this._mapper = wrap(mapper);
    this._opt = _.defaults(opt || {}, { parallel: 1 });
    this._cnt = 0;
  }

  _transform(data, encoding, done) {
    if (this._err) return done(this._err);

    const parallel = this._opt.parallel;

    if (!this._opt.objectMode && this._opt.encoding && Buffer.isBuffer(data)) data = data.toString(this._opt.encoding);

    this._mapper(data).then(mappedData => {
      if (this._opt.isFilter) {
        if (mappedData) this.push(data);
      } else if (mappedData !== null && mappedData !== undefined) {
        this.push(mappedData);
      }

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
    else console.error('co-stream/map-stream: This should not happen.');
  }

  _flush(done) {
    const me = this;
    co(function *() {
      while (me._cnt > 0) yield _.sleep(1);
      done();
    });
  }
}

module.exports = MapStream;