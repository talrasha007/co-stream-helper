#co-stream
Construct co-pipes of streams. Parallel processing supported.

## Installation
```
npm install co-stream
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

// Object mode can process object streams such as mongodb stream.
co(function *() {
    var objstream = collection.find({ age: { $gte: 10, $lt: 15 } }).stream(),
        reader = new (cs.Reader)(objstream, { objectMode: true });

    var obj;
    while (obj = (yield  reader.read())) {
        // blabla....
    }
})();
```
