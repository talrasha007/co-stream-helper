var _ = require('codash'),
    fs = require('fs'),

    cs = require('../');

var total = 0;
fs.createReadStream('test.log')
    .pipe(cs.string.map(function *(data) { total += data.length; yield _.sleep(1000); return data.slice(0, 1); }, { parallel: 3 }))
    .pipe(process.stdout);

var Emiter = require('events').EventEmitter,
    em = new Emiter();

var evs = cs.object.fromEmmiter(em, { objectMode: true });

evs.pipe(cs.object.map(function *(data) { return JSON.stringify(data); })).pipe(process.stdout);

em.emit('data', { a: 1 });

process.on('exit', function () {
    console.log('\n Total: ', total);
});

