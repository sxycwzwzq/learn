/**
 * Created by ben on 9/23/16.
 */
const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'myapp' });

const toss = () => new Promise((resolve) => {
  const n = Math.floor(Math.random() * 6) + 1;
  resolve(n);
});

const threeDice = () => {
  const tosses = [];
  const add = (x, y) => x + y;
  for (let i = 0; i < 3; i += 1) { tosses.push(toss()); }
  const res = Promise.all(tosses).then((result) => { result.reduce(add); });
  return res;
};

const logResults = (result) => {
  log.info(`Rolled ${result} with three dice.`);
};

const logErrorMessage = (error) => {
  log.info(`Oops: ${error.message}`);
};

threeDice()
.then(logResults)
.then(null, logErrorMessage);
