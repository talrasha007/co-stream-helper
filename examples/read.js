var co = require('co'),
    fs = require('fs'),
    Reader = require('../').Reader,
    LineReader = require('../').LineReader;

function sleep(mill) {
    return function (cb) { setTimeout(cb, mill); };
}

co(function *() {
    var input = fs.createReadStream('test.log'),
        reader = new Reader(input),
        start = Date.now(),
        txt;

    while (txt = yield reader.read('utf8')) {
        //console.log(txt);
        //yield sleep(100);
    }

    console.log('done. %d ms.', Date.now() - start);
})(function (err) {
    if (err) console.log(err);
});

co(function *() {
    var input = fs.createReadStream('test.log'),
        reader = new LineReader(input),
        start = Date.now(),
        cnt = 0,
        txt;

    var last = 0;
    while (typeof (txt = yield reader.read()) === 'string') {
        cnt++;
        //console.log('line: ' + txt);
        //yield sleep(0);
    }

    console.log('done. %d lines, %d ms.', cnt, Date.now() - start);
})(function (err) {
    if (err) console.log(err);
});
