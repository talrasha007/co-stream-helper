var util = require('util'),
    Readable = require('stream').Readable;

function EventStream(emiter, opt) {
    Readable.call(this, opt);

    var me = this;
    this._emiter = emiter;
    this._emiter.on((opt && opt.data) || 'data', function (data) { me.push(data); });
    this._emiter.on((opt && opt.end) || 'end', function () { me.push(null); });
}

util.inherits(EventStream, Readable);

var oriPause = EventStream.prototype.pause,
    oriResume = EventStream.prototype.resume;

EventStream.prototype._read = function () {

};

EventStream.prototype.pause = function () {
    this._emiter.pause && this._emiter.pause();
    oriPause.call(this);
};

EventStream.prototype.resume = function () {
    oriResume.call(this);
    this._emiter.resume && this._emiter.resume();
};

module.exports = EventStream;
