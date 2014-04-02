var co = require('co'),
    fs = require('fs'),

    Writer = require('../').Writer;

var start = Date.now();
co(function *() {
    var out = fs.createWriteStream('test.log'),
        writer = new Writer(out, true);

    for (var i = 0; i < 1024 * 100; i++) {
        yield writer.writeline(i);
    }

    yield writer.end();
})(function (err) {
    console.log(err || 'done', Date.now() - start);
});
