var util = require('util'),
    Transform = require('stream').Transform;

var Writer = exports.Writer = function (out, cachemode) {
    Transform.call(this);

    if (cachemode) {
        this._cache = [];
        this._cachedLength = 0;
    }

    if (out) this.pipe(out);
};

util.inherits(Writer, Transform);

Writer.prototype._transform = function (chunk, encoding, done) {
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
};

Writer.prototype._flush = function (callback) {
    if (this._endFlag && this._cache && this._cache.length > 0) {
        this.push(Buffer.concat(this._cache));
        this._cache = [];
        this._cachedLength = 0;
    }

    process.nextTick(callback);
};

Writer.prototype.write = function (chunk, encoding) {
    var me = this;
    return function (cb) {
        Transform.prototype.write.call(me, chunk, encoding, cb);
    };
};

Writer.prototype.writeline = function (line, CRLF) {
    return this.write(line + (CRLF ? '\r\n' : '\n'));
};

Writer.prototype.end = function (chunk, encoding) {
    this._endFlag = true;
    var me = this;
    return function (cb) {
        Transform.prototype.end.call(me, chunk, encoding, cb);
    };
};
