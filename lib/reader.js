var util = require('util'),
    Writable = require('stream').Writable;

var Reader = exports.Reader = function (input) {
    this._helper = new StreamReaderHelper(input);
};

Reader.prototype = {
    read: function *(encoding) {
        var chunk = yield this._helper.readData();
        return encoding ? chunk.toString(encoding) : chunk;
    }
};

function StreamReaderHelper (input) {
    var me = this;

    input.pipe(this);
    input.on('end', function () { me._end = true; });
    input.on('error', function (err) { me._err = err; });
}

util.inherits(StreamReaderHelper, Writable);

StreamReaderHelper.prototype.readData = function () {
    Writable.call(this);

    var me = this;

    return function (cb) {
        if (me._data) {
            cb(null, me._data);
            me._data = null;
        } else if (me._end) {
            cb();
        } else if (me._err) {
            cb(me._err);
        } else {
            me._readCb = cb;
        }
    };
};

StreamReaderHelper.prototype._write = function (chunk, encoding, callback) {
    if (this._readCb) {
        this._readCb(null, chunk);
    } else {
        this._data = chunk;
    }
};
