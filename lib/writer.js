var util = require('util'),
    Transform = require('stream').Transform;

var Writer = exports.Writer = function (out) {
    Transform.call(this);

    if (out) this.pipe(out);
};

util.inherits(Writer, Transform);

Writer.prototype._transform = function (chunk, encoding, done) {
    this.push(chunk);
    done();
};

Writer.prototype.write = function (chunk, encoding) {
    var me = this;
    return function (cb) {
        Transform.prototype.write.call(me, chunk, encoding, cb);
    };
};

Writer.prototype.end = function (chunk, encoding) {
    var me = this;
    return function (cb) {
        Transform.prototype.end.call(me, chunk, encoding, cb);
    };
};
