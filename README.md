Poel
===

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

Create a pool of cluster workers.

### Usage

```js
const poel = require('poel');
(async () => {
  const pool = poel({
    getPid,
    sayHi,
  });
  for (let i = 0; i < 10; i++) {
    // On an 8 core system, this should print 8 unique pids
    // and then start then start repeating pids.
    console.log(await pool.getPid())
  }
  await pool.$.shutdown();
})();

function getPid() {
  return process.pid;
}

function sayHi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('hi'), 200);
  });
}
```

### Explanation

`poel` takes an object of functions which it then returns as
a pool of workers with those same functions. In the example
above, it was passed the `getId` and `sayHi` functions. The
`pool` object returned also has a `getId` and `sayHi`
method. Calling any method will cycle through the workers, so
in the example above it will print as many unique numbers as
there CPU cores on the system. If we called `sayHi` after
every `getPid` the output from the `getPid` would never
include the pids of the odd numbered workers.

### Gotchas

`poel` uses [`cluster`](https://nodejs.org/api/cluster.html)
mode under the hood. The main thing to keep in mind is that
you must `await` (or `Promise.resolve()`) the call to `poel`
before the main logic of your script. The call to `poel` will
only resolve for the master process, which most of the time
is really all you want.

The example above takes advantage of
[function hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#Function_declaration_hoisting)
so as to be able to have the main logic near the top of the
file. If the functions were instead declared as  
`const getPid = () => process.pid` then you would need to
have that line above the call to `poel`.

---

/pōel/ פועל. *po* as in Edgar Allan Poe, *el* as in the 12th
letter of the alphabet (`L`).  
Poel means worker in Hebrew.

[npm-image]: https://img.shields.io/npm/v/poel.svg?style=flat-square
[npm-url]: https://npmjs.org/package/poel
[travis-image]: https://img.shields.io/travis/kolodny/poel.svg?style=flat-square&branch=master
[travis-url]: https://travis-ci.org/kolodny/poel
[downloads-image]: http://img.shields.io/npm/dm/poel.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/poel
