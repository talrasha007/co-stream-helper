var _ = require('codash'),
    fs = require('fs'),

    cs = require('../');

var total = 0;
fs.createReadStream('test.log')
    .pipe(cs.map(function *(data) { total += data.length; yield _.sleep(1000); return data.slice(0, 1); }, { parallel: 3 }))
    .pipe(process.stdout);

process.on('exit', function () {
    console.log('\n Total: ', total);
});