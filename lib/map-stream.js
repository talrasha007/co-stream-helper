var _ = require('co-lodash'),
    util = require('util'),
    co = require('co'),

    Transform = require('stream').Transform;

function MapStream(mapper, opt) {
    Transform.call(this, opt);

    this._mapper = co.wrap(mapper);
    this._opt = _.defaults(opt || {}, { parallel: 1 });
    this._cnt = 0;
}

util.inherits(MapStream, Transform);

MapStream.prototype._transform  = function (data, encoding, done) {
    if (this._err) return done(this._err);

    var me = this, parallel = this._opt.parallel;

    if (!this._opt.objectMode && this._opt.encoding && Buffer.isBuffer(data)) data = data.toString(this._opt.encoding);

    this._mapper.call(null, data).then(function (mappedData) {
        if (mappedData) me.push(mappedData);
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
    else console.error('co-stream/map-stream: This should not happen.');
};

MapStream.prototype._flush = function (done) {
    var me = this;
    co(function *() {
        while (me._cnt > 0) yield _.sleep(1);
        done();
    });
};

module.exports = MapStream;
