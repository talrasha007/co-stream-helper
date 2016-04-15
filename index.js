var _ = require('co-lodash'),
    through = require('through'),
    duplex = require('duplexer'),
    pause = require('pause-stream'),
    split = require('split');

exports.through = through;
exports.duplex = duplex;
exports.pause = pause;
exports.split = split;

exports.wait = function *(stream) {
    yield function (cb) {
        stream.on('end', cb);
        stream.on('finish', cb);
    };
};

exports.Reader = require('./lib/reader.js').Reader;
exports.LineReader = require('./lib/reader.js').LineReader;
exports.Writer = require('./lib/writer.js').Writer;

var EachStream = require('./lib/each-stream.js'),
    MapStream = require('./lib/map-stream.js'),
    EventStream = require('./lib/event-stream.js');

exports.object = {
    each: function (iterator, opt) { return new EachStream(iterator, _.defaults(opt || {}, { objectMode: true })); },
    map: function (mapper, opt) { return new MapStream(mapper, _.defaults(opt || {}, { objectMode: true })); },
    fromEmitter: function (em, opt) { return new EventStream(em, _.defaults(opt || {}, { objectMode: true })); }
};

exports.string = {
    each: function (iterator, opt) { return new EachStream(iterator, _.defaults(opt || {}, { encoding: 'utf8' })); },
    map: function (mapper, opt) { return new MapStream(mapper, _.defaults(opt || {}, { encoding: 'utf8' })); },
    fromEmitter: function (em, opt) { return new EventStream(em, _.defaults(opt || {}, { encoding: 'utf8' })); }
};

_.extend(exports, {
    each: function (iterator, opt) { return new EachStream(iterator, opt); },
    map: function (mapper, opt) { return new MapStream(mapper, opt); },
    fromEmitter: function (em, opt) { return new EventStream(em, opt); }
});
