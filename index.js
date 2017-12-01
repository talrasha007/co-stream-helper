const _ = require('co-lodash');
const through = require('through');
const duplex = require('duplexer');
const pause = require('pause-stream');
const split = require('split');

exports.through = through;
exports.duplex = duplex;
exports.pause = pause;
exports.split = split;

exports.wait = stream => new Promise((resolve, reject) => {
  stream.on('end', resolve);
  stream.on('finish', resolve);
  stream.on('error', reject);
});

exports.Reader = require('./lib/reader.js').Reader;
exports.LineReader = require('./lib/reader.js').LineReader;
exports.Writer = require('./lib/writer.js').Writer;

const EachStream = {
  sync: require('./lib/sync/each-stream.js'),
  async: require('./lib/async/each-stream.js')
};

const MapStream = {
  sync: require('./lib/sync/map-stream.js'),
  async: require('./lib/async/map-stream.js')
};

const getEachStream = (iter, opt) => (opt.async || _.isGenerator(iter) || _.isAsyncFunction(iter)) ? EachStream.async(iter, opt) : EachStream.sync(iter, opt);
const getMapStream = (iter, opt) => (opt.async || _.isGenerator(iter) || _.isAsyncFunction(iter)) ? MapStream.async(iter, opt) : MapStream.sync(iter, opt);

const EventStream = require('./lib/event-stream.js');
const IterableStream = require('./lib/iterable-stream');

exports.object = {
  each: (iterator, opt) => getEachStream(iterator, _.defaults(opt || {}, { objectMode: true })),
  map: (mapper, opt) => getMapStream(mapper, _.defaults(opt || {}, { objectMode: true })),
  flatMap: (mapper, opt) => getMapStream(mapper, _.defaults(opt || {}, { flatten: true, objectMode: true })),
  filter: (filter, opt) => getMapStream(filter, _.defaults(opt || {}, { objectMode: true, isFilter: true  })),
  fromEmitter: (em, opt) => new EventStream(em, _.defaults(opt || {}, { objectMode: true }))
};

exports.string = {
  each: (iterator, opt) => getEachStream(iterator, _.defaults(opt || {}, { encoding: 'utf8' })),
  map: (mapper, opt) => getMapStream(mapper, _.defaults(opt || {}, { encoding: 'utf8' })),
  flatMap: (mapper, opt) => getMapStream(mapper, _.defaults(opt || {}, { flatten: true, encoding: 'utf8' })),
  filter: (filter, opt) => getMapStream(filter, _.defaults(opt || {}, { encoding: 'utf8', isFilter: true })),
  fromEmitter: (em, opt) => new EventStream(em, _.defaults(opt || {}, { encoding: 'utf8' }))
};

_.extend(exports, {
  each: (iterator, opt) => getEachStream(iterator, opt),
  map: (mapper, opt) => getMapStream(mapper, opt),
  fromIterable: iterable => new IterableStream(iterable),
  fromEmitter: (em, opt) => new EventStream(em, opt)
});