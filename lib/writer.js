const Transform = require('stream').Transform;

class Writer extends Transform {
  constructor(out, cachemode) {
    super();

    if (cachemode) {
      this._cache = [];
      this._cachedLength = 0;
    }

    if (out) this.pipe(out);
  }

  _transform(chunk, encoding, done) {
    if (!this._cache) {
      this.push(chunk);
    } else {
      this._cache.push(chunk);
      this._cachedLength += chunk.length;

      if (this._cachedLength > 0x10000) {
        this.push(Buffer.concat(this._cache));
        this._cache = [];
        this._cachedLength = 0;
      }
    }

    process.nextTick(done);
  }

  _flush(callback) {
    if (this._endFlag && this._cache && this._cache.length > 0) {
      this.push(Buffer.concat(this._cache));
      this._cache = [];
      this._cachedLength = 0;
    }

    process.nextTick(callback);
  }

  write(chunk, encoding) {
    return cb => super.write(chunk, encoding, cb);
  }

  writeLine(line, CRLF) {
    return this.write(line + (CRLF ? '\r\n' : '\n'));
  }

  end(chunk, encoding) {
    this._endFlag = true;
    return cb => super.end(chunk, encoding, cb);
  }
}

module.exports = { Writer };