const co = require('co');
const fs = require('fs');

const cs = require('../');

let cnt = 0;
fs.createReadStream('test.log', {flags: 'r'})
  .pipe(cs.split())
  .pipe(cs.object.map(line => `line ${cnt++}: ${line}`))
  .pipe(cs.object.each(line => {
    //do something with the line
    console.log(line);
  }));