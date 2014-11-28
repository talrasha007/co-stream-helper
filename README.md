#co-stream
[Streams](http://nodejs.org/api/stream.html "Stream") are node's best and most misunderstood idea, and _<em>co-stream</em>_ is a toolkit to make creating and working with streams <em>easy</em>. 

This package is very similar to [event-stream](https://github.com/dominictarr/event-stream), the difference is this package is in [co](https://github.com/tj/co) style, so we can write async stream processing code in a nice way.

## Installation
```
npm install co-stream
```

## wait(stream)

Wait for stream 'end'/'finish' event;

```
co(function *() {
  // blabla
  yield* cs.wait(your_stream);
});
```

## through (write?, end?)

Re-emits data synchronously. Easy way to create synchronous through streams.
Pass in optional `write` and `end` methods. They will be called in the 
context of the stream. Use `this.pause()` and `this.resume()` to manage flow.
Check `this.paused` to see current flow state. (write always returns `!this.paused`)

this function is the basis for most of the synchronous streams in `event-stream`.

``` js
cs.through(function write(data) {
    this.emit('data', data)
    //this.pause() 
  },
  function end () { //optional
    this.emit('end')
  })
```

## map

Create a map stream from an generator function.  

``` js
var cs = require('co-stream')

var ms = cs.map(function *(data) {
  //transform data
  return transformed_data;
}, { objectMode: true, parallel: 3 });

your_source_stream.pipe(ms).pipe(your_dest_stream);

// parallel param will allow you to process data parallelly, but the sequence of data may be changed, be careful.
// cs.object.map (cs.map with default opt { objectMode: true })
// cs.string.map (cs.map with default opt { encoding: 'utf8' })
```

## each

If you just want to process data without any data to output, use this.

``` js
var cs = require('co-stream')

var ms = cs.each(function *(data) {
  // process data
}, { objectMode: true, parallel: 3 });

your_source_stream.pipe(ms);
// NOTE: ms.pipe is invalid.

// parallel param will allow you to process data parallelly, but the sequence of data may be changed, be careful.
// cs.object.each (cs.each with default opt { objectMode: true })
// cs.string.each (cs.each with default opt { encoding: 'utf8' })
```

## split (matcher)

Break up a stream and reassemble it so that each line is a chunk. matcher may be a `String`, or a `RegExp` 

Example, read every line in a file ...

``` js
fs.createReadStream(file, {flags: 'r'})
  .pipe(cs.split())
  .pipe(cs.string.each(function *(line) {
    //do something with the line 
    console.log('line: ', line);
  }))
```

## duplex (writeStream, readStream)

Takes a writable stream and a readable stream and makes them appear as a readable writable stream.

It is assumed that the two streams are connected to each other in some way.  

(This is used by `pipeline` and `child`.)

``` js
  var grep = cp.exec('grep Stream')

  cs.duplex(grep.stdin, grep.stdout)
```

## Legacy API

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
