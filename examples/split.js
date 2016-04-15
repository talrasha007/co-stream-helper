var _ = require('co-lodash'),
    co = require('co'),
    fs = require('fs'),

    cs = require('../');

fs.createReadStream('test.log', {flags: 'r'})
    .pipe(cs.split())
    .pipe(cs.object.each(function *(line) {
        //do something with the line
        console.log('line: ', line);
    }));