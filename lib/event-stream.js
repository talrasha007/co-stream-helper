var util = require('util'),
    Readable = require('stream').Readable;

function EventStream(emiter, opt) {
    Readable.call(this, opt);

    var me = this;
    this._emiter = emiter;
    this._emiter.on((opt && opt.end) || 'end', function () { me.push(null); });

    this._pauseEmitter = opt.pause || this._emiter.pause || function () {};
    this._resumeEmitter = opt.resume || this._emiter.resume || function () {};

    this._emiter.on((opt && opt.data) || 'data', function (data) {
        if (!me.push(data) && !me._paused) {
            me._paused = true;
            me._pauseEmitter.call(me._emiter);
        }
    });
}

util.inherits(EventStream, Readable);

EventStream.prototype._read = function () {
    this._paused = false;
    if (this._emiter.resume) this._resumeEmitter.call(this._emiter);
};

module.exports = EventStream;
