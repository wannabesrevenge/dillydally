# dillydally

## Install
`npm install dillydally`

## How to use
```javascript
var queue = require('dillydally');

// Normal function
function foo() { return 'party'; }

// Function returns a promise
function bar() { return Promise.resolve('poop'); }

// Add a function to run in the job queue
queue.addJob(foo).then(console.log) // prints 'party'
queue.addJob(bar).then(console.log) // prints 'poop'

// waits 500 ms then prints 'party'
queue.addJob(500, foo).then(console.log)

// waits 1000 ms after the previous job then prints 'poop'
queue.addJob(1000, bar).then(console.log)

// prints 'poop' immediately after the previous job
queue.addJob(bar).then(console.log)

// Specify the context for the function to run in
function baz() { return this.test }
queue.addJob({context: {test: 'derp'}}, baz).then(console.log) // prints 'derp'

// Specify context and delay
queue.addJob({delay: 500, context: {test: 'derp'}}, baz).then(console.log) // prints 'derp' after 500ms

// Supply your own Promise lib
queue.Promise = require('bluebird');
```
