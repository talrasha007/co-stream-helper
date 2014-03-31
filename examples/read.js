var co = require('co'),
    fs = require('fs'),
    Reader = require('../').Reader,
    LineReader = require('../').LineReader;

co(function *() {
    var input = fs.createReadStream('read.js'),
        reader = new Reader(input),
        txt;

    while (txt = yield reader.read('utf8')) {
        console.log(txt);
    }
})(function (err) {
    if (err) console.log(err);
});

co(function *() {
    var input = fs.createReadStream('read.js'),
        reader = new LineReader(input),
        txt;

    while (typeof (txt = yield reader.read('utf8')) === 'string') {
        console.log('line: ' + txt);
    }
})(function (err) {
    if (err) console.log(err);
});
