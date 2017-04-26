const Readable = require('stream').Readable;

class EventStream extends Readable {
  constructor(emitter, opt) {
    super(opt);

    this._emitter = emitter;
    this._emitter.on((opt && opt.end) || 'end', () => this.push(null));

    this._pauseEmitter = opt.pause || this._emitter.pause || function () {};
    this._resumeEmitter = opt.resume || this._emitter.resume || function () {};

    this._emitter.on((opt && opt.data) || 'data', data => {
      if (!this.push(data) && !this._paused) {
        this._paused = true;
        this._pauseEmitter.call(this._emitter);
      }
    });
  }

  _read() {
    if (this._paused) {
      this._paused = false;
      if (this._emitter.resume) this._resumeEmitter.call(this._emitter);
    }
  }
}

module.exports = EventStream;