const co = require('co');
const fs = require('fs');
const Writer = require('../').Writer;

const start = Date.now();
co(function *() {
    let out = fs.createWriteStream('test.log'),
        writer = new Writer(out, true);

    for (let i = 0; i < 1024 * 100; i++) {
        yield writer.writeline(i);
    }

    yield writer.end();
}).catch(function (err) {
    console.log(err || 'done', Date.now() - start);
});
