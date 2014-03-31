var co = require('co'),
    fs = require('fs'),
    Reader = require('../').Reader;

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
