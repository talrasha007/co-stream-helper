var _ = require('codash');

exports.Reader = require('./lib/reader.js').Reader;
exports.LineReader = require('./lib/reader.js').LineReader;
exports.Writer = require('./lib/writer.js').Writer;

var EachStream = require('./lib/each-stream.js'),
    MapStream = require('./lib/map-stream.js'),
    EventStream = require('./lib/event-stream.js');

exports.object = {
    each: function (iterator, opt) { return new EachStream(iterator, _.defaults(opt || {}, { objectMode: true })); },
    map: function (mapper, opt) { return new MapStream(mapper, _.defaults(opt || {}, { objectMode: true })); },
    fromEmmiter: function (em, opt) { return new EventStream(em, _.defaults(opt || {}, { objectMode: true })); }
};

exports.string = {
    each: function (iterator, opt) { return new EachStream(iterator, _.defaults(opt || {}, { encoding: 'utf8' })); },
    map: function (mapper, opt) { return new MapStream(mapper, _.defaults(opt || {}, { encoding: 'utf8' })); },
    fromEmmiter: function (em, opt) { return new EventStream(em, _.defaults(opt || {}, { encoding: 'utf8' })); }
};
