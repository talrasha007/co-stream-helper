var _ = require('codash');

exports.Reader = require('./lib/reader.js').Reader;
exports.LineReader = require('./lib/reader.js').LineReader;
exports.Writer = require('./lib/writer.js').Writer;

var MapStream = require('./lib/map-stream.js');
var EventStream = require('./lib/event-stream.js');

exports.object = {
    map: function (mapper, opt) { return new MapStream(mapper, _.defaults(opt || {}, { objectMode: true })); },
    fromEmmiter: function (em, opt) { return new EventStream(em, _.defaults(opt || {}, { objectMode: true })); }
};

exports.string = {
    map: function (mapper, opt) { return new MapStream(mapper, _.defaults(opt || {}, { encoding: 'utf8' })); },
    fromEmmiter: function (em, opt) { return new EventStream(em, _.defaults(opt || {}, { encoding: 'utf8' })); }
};
