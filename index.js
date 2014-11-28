exports.Reader = require('./lib/reader.js').Reader;
exports.LineReader = require('./lib/reader.js').LineReader;
exports.Writer = require('./lib/writer.js').Writer;

var MapStream = require('./lib/map-stream.js');
exports.map = function (mapper, opt) { return new MapStream(mapper, opt); };