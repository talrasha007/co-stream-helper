var _ = require('co-lodash'),
    co = require('co'),
    util = require('util'),
    Writable = require('stream').Writable;

function EachStream(iterator, opt) {
    Writable.call(this, opt);

    this._iterator = co.wrap(iterator);
    this._opt = _.defaults(opt || {}, { parallel: 1 });
    this._cnt = 0;
}

util.inherits(EachStream, Writable);

EachStream.prototype._write = function (data, encoding, done) {
    if (this._err) return done(this._err);

    var me = this, parallel = this._opt.parallel;

    if (!this._opt.objectMode && this._opt.encoding && Buffer.isBuffer(data)) data = data.toString(this._opt.encoding);

    this._iterator.call(null, data).then(function () {
        me._cnt--;

        if (me._wait && me._cnt < parallel) {
            process.nextTick(me._wait);
            me._wait = null;
        }
    }, function (err) {
        me._err = err;
        me._cnt--;

        if (me._wait && me._cnt < parallel) {
            process.nextTick(me._wait);
            me._wait = null;
        }
    });

    if (++this._cnt < parallel) done();
    else if (!this._wait) this._wait = done;
    else console.error('co-stream/each-stream: This should not happen.');
};

module.exports = EachStream;
