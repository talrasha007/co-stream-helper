const _ = require('co-lodash');
const through = require('through');
const duplex = require('duplexer');
const pause = require('pause-stream');
const split = require('split');

exports.through = through;
exports.duplex = duplex;
exports.pause = pause;
exports.split = split;

exports.wait = function *(stream) {
  yield cb => {
    stream.on('end', cb);
    stream.on('finish', cb);
  };
};

exports.Reader = require('./lib/reader.js').Reader;
exports.LineReader = require('./lib/reader.js').LineReader;
exports.Writer = require('./lib/writer.js').Writer;

const EachStream = require('./lib/each-stream.js');
const MapStream = require('./lib/map-stream.js');
const EventStream = require('./lib/event-stream.js');
const IterableStream = require('./lib/iterable-stream');

exports.object = {
  each: (iterator, opt) => new EachStream(iterator, _.defaults(opt || {}, { objectMode: true })),
  map: (mapper, opt) => new MapStream(mapper, _.defaults(opt || {}, { objectMode: true })),
  filter: (filter, opt) => new MapStream(filter, _.defaults(opt || {}, { objectMode: true, isFilter: true  })),
  fromEmitter: (em, opt) => new EventStream(em, _.defaults(opt || {}, { objectMode: true }))
};

exports.string = {
  each: (iterator, opt) => new EachStream(iterator, _.defaults(opt || {}, { encoding: 'utf8' })),
  map: (mapper, opt) => new MapStream(mapper, _.defaults(opt || {}, { encoding: 'utf8' })),
  filter: (filter, opt) => new MapStream(filter, _.defaults(opt || {}, { encoding: 'utf8', isFilter: true })),
  fromEmitter: (em, opt) => new EventStream(em, _.defaults(opt || {}, { encoding: 'utf8' }))
};

_.extend(exports, {
  each: (iterator, opt) => new EachStream(iterator, opt),
  map: (mapper, opt) => new MapStream(mapper, opt),
  fromIterable: iterable => new IterableStream(iterable),
  fromEmitter: (em, opt) => new EventStream(em, opt)
});