const cs = require('../');

cs.fromIterable([1, 2, 3, 4, 5, 6, 7, 8])
  .pipe(cs.object.each(it => {
    //do something with the line
    console.log(it);
  }));