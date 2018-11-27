# callbag-from-iter

Convert a JS Iterable or Iterator to a callbag pullable source (it only sends data when requested).

`npm install callbag-from-iter`

## example

Convert an Iterable:

```js
const fromIter = require('callbag-from-iter');
const forEach = require('callbag-for-each');

const source = fromIter([10, 20, 30, 40]);

forEach(x => console.log(x)(source);  // 10
                                      // 20
                                      // 30
                                      // 40
```

Convert an Iterator:

```js
const fromIter = require('callbag-from-iter');
const forEach = require('callbag-for-each');

const source1 = fromIter([10, 20, 30, 40].entries());

forEach(x => console.log(x))(source1); // [0,10]
                                       // [1,20]
                                       // [2,30]
                                       // [3,40]

const source2 = fromIter(new Map().set('a', 1).set('b', 2));

forEach(x => console.log(x))(source2); // ['a', 1]
                                       // ['b', 2]
```
