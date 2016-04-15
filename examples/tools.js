var _ = require('co-lodash'),
    co = require('co'),
    fs = require('fs'),

    cs = require('../');

var total = 0;
fs.createReadStream('test.log')
    .pipe(cs.string.map(function *(data) { total += data.length; yield _.sleep(1000); return data.slice(0, 1); }, { parallel: 3 }))
    .pipe(process.stdout);

var Emitter = require('events').EventEmitter,
    em = new Emitter();

var evs = cs.object.fromEmitter(em);

evs.pipe(cs.object.map(function *(data) { return _.extend({ xx: data.a }, data); }))
   .pipe(cs.object.each(function *(data) { yield _.sleep(1000); console.log(data); }, { parallel: 2 }));

(function () {
    for (var i = 0; i < 4; i++) {
        evs.emit('data', { a: i });
    }
})();

process.on('exit', function () {
    console.log('\n Total: ', total);
});

