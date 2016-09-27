/**
 * Created by ben on 9/25/16.
 */
const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'myapp' });

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

let count = 0;


myEmitter.on('event', (data) => {
  setImmediate(() => {
    log.info(`asynchronously ${data} ${count}`);
  });
  log.info(`an event occured!\nthe data is ${data} ${this} ${count += 1}`);
});

myEmitter.once('newListener', (event) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      // console.log('B');
    });
  }
});

myEmitter.on('event', () => {
  // console.log('A');
});

myEmitter.emit('event', 'wzq');
myEmitter.emit('event', 'wzq');
myEmitter.emit('only', 'wzq');
myEmitter.emit('only', 'wzq');
myEmitter.emit('event');
// console.log(EventEmitter.listenerCount(myEmitter, 'event'));
process.on('uncaughtException', (err) => {
  log.info(`whoops! there was an error ${err}`);
});

myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
