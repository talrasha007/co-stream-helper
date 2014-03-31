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
        txt;

    while (txt = yield reader.read('utf8')) {
        console.log(txt);
        //yield sleep(100);
    }

    console.log('done');
})(function (err) {
    if (err) console.log(err);
});

co(function *() {
    var input = fs.createReadStream('test.log'),
        reader = new LineReader(input),
        txt;

    while (typeof (txt = yield reader.read('utf8')) === 'string') {
        console.log('line: ' + txt);
        yield sleep(1);
    }

    console.log('done');
})(function (err) {
    if (err) console.log(err);
});
