var util = require('util'),
    Readable = require('stream').Readable;

function EventStream(emitter, opt) {
    Readable.call(this, opt);

    var me = this;
    this._emitter = emitter;
    this._emitter.on((opt && opt.end) || 'end', function () { me.push(null); });

    this._pauseEmitter = opt.pause || this._emitter.pause || function () {};
    this._resumeEmitter = opt.resume || this._emitter.resume || function () {};

    this._emitter.on((opt && opt.data) || 'data', function (data) {
        if (!me.push(data) && !me._paused) {
            me._paused = true;
            me._pauseEmitter.call(me._emitter);
        }
    });
}

util.inherits(EventStream, Readable);

EventStream.prototype._read = function () {
    this._paused = false;
    if (this._emitter.resume) this._resumeEmitter.call(this._emitter);
};

module.exports = EventStream;
