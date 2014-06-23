co-stream
================

A node.js stream helper in harmony style.

## Installation

```
npm install express-schema
```

## Usage

```javascript
var cs = require('co-stream'),
    co = require('co'),
    fs = require('fs');

co(function *() {
  var input = fs.createReadStream('test.in'),
      output = fs.createWriteStream('test.out');
      
  var cin = new (cs.Reader)(input), // new (cs.LineReader)(input) will create a line reader.
      cout = new (cs.Writer)(output);
      
  var txt;
  while (txt = yield cin.read('utf8')) {
    yield cout.write(txt); // or: yield cout.writeline(txt)
  }
})();
```
