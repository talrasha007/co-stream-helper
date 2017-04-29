const cs = require('../');

cs.fromIterable([1, 2, 3, 4, 5, 6, 7, 8]).pipe(cs.object.each(console.log));

const promise = new Promise(resolve => setTimeout(() => resolve(['a', 'b', 'c']), 1000));
cs.fromIterable(promise).pipe(cs.object.each(console.log));