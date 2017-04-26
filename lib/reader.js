const Writable = require('stream').Writable;

class Reader {
  constructor(input, opt) {
    this._helper = new StreamReaderHelper(input, opt);
  }

  *read(encoding) {
    const chunk = yield this._helper.readData();
    return chunk && (encoding ? chunk.toString(encoding) : chunk);
  }
}

class LineReader {
  constructor(input) {
    this._helper = new StreamReaderHelper(input);
    this._lines = [];
  }

  *read() {
    if (this._lines.length > 0) {
      return this._lines.shift().replace('\r', '');
    } else {
      while (this._lines.length === 0) {
        let chunk = yield this._helper.readData();
        if (!chunk) {
          let ret = this._incomplete;
          this._incomplete = null;
          return ret;
        }

        let data = chunk.toString(),
            lines = data.split('\n'),
            incomplete = !data.endsWith('\n');

        if (!incomplete) lines.pop();
        if (this._incomplete) lines[0] = this._incomplete + lines[0];

        this._incomplete = incomplete ? lines.pop() : null;

        this._lines = lines;
      }

      return this._lines.shift().replace('\r', '');
    }
  }
}

module.exports = { Reader, LineReader };

class StreamReaderHelper extends Writable {
  constructor(input, opt) {
    super(opt);

    let me = this;
    input.pipe(this);
    input.on('error', function (err) {
      me._err = err;
      me._callReadCb(err);
    });

    this.on('finish', function () {
      me._end = true;
      me._callReadCb();
    });
  }

  _callReadCb() {
    let rcb = this._readCb;
    if (rcb) {
      this._readCb = null;

      let args = arguments;
      process.nextTick(function () { rcb.apply(null, args); });
    }
  }

  readData() {
    return cb => {
      if (this._readCb) return cb(new Error('Reader already exists.'));

      if (this._data) {
        let data = this._data,
          dataCb = this._dataCb;

        this._data = null;
        this._dataCb = null;

        process.nextTick(function () {
          dataCb();
          cb(null, data);
        });
      } else if (this._end) {
        process.nextTick(cb);
      } else if (this._err) {
        process.nextTick(function () { cb(this._err); });
      } else {
        this._readCb = cb;
      }
    };
  }

  _write(chunk, encoding, callback) {
    if (this._readCb) {
      this._callReadCb(null, chunk);
      callback();
    } else {
      this._data = chunk;
      this._dataCb = callback;
    }
  }
}