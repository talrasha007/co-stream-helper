var util = require('util'),
    Writable = require('stream').Writable;

var Reader = exports.Reader = function (input, opt) {
    this._helper = new StreamReaderHelper(input, opt);
};

Reader.prototype = {
    read: function *(encoding) {
        var chunk = yield this._helper.readData();
        return chunk && (encoding ? chunk.toString(encoding) : chunk);
    }
};

var LineReader = exports.LineReader = function (input) {
    this._helper = new StreamReaderHelper(input);
    this._lines = [];
};

LineReader.prototype = {
    read: function *() {
        if (this._lines.length > 0) {
            return this._lines.shift().replace('\r', '');
        } else {
            while (this._lines.length === 0) {
                var chunk = yield this._helper.readData();
                if (!chunk) {
                    var ret = this._incomplete;
                    this._incomplete = null;
                    return ret;
                }

                var data = chunk.toString(),
                    lines = data.split('\n'),
                    incomplete = data[data.length - 1] !== '\n';

                if (this._incomplete) lines[0] = this._incomplete + lines[0];
                this._incomplete = incomplete ? lines.pop() : null;

                this._lines = lines;
            }

            return this._lines.shift().replace('\r', '');
        }
    }
};

function StreamReaderHelper (input, opt) {
    Writable.call(this, opt);

    var me = this;
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

util.inherits(StreamReaderHelper, Writable);

StreamReaderHelper.prototype._callReadCb = function () {
    var rcb = this._readCb;
    if (rcb) {
        this._readCb = null;

        var args = arguments;
        process.nextTick(function () { rcb.apply(null, args); });
    }
};

StreamReaderHelper.prototype.readData = function () {
    var me = this;

    return function (cb) {
        if (me._readCb) return cb(new Error('Reader already exists.'));

        if (me._data) {
            var data = me._data,
                dataCb = me._dataCb;

            me._data = null;
            me._dataCb = null;

            process.nextTick(function () {
                dataCb();
                cb(null, data);
            });
        } else if (me._end) {
            process.nextTick(cb);
        } else if (me._err) {
            process.nextTick(function () { cb(me._err); });
        } else {
            me._readCb = cb;
        }
    };
};

StreamReaderHelper.prototype._write = function (chunk, encoding, callback) {
    if (this._readCb) {
        this._callReadCb(null, chunk);
        callback();
    } else {
        this._data = chunk;
        this._dataCb = callback;
    }
};
