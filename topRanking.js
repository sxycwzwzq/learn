/**
 * Created by ben on 9/26/16.
 */
const readline = require('readline');

const request = require('request');

const Priorityqueue = require('priorityqueuejs');

const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'myapp' });
const url = 'https://gist.githubusercontent.com/tyrchen/32c50aadca48aee3da10a77a18479517/'
  + 'raw/7da00efd07b31ba8263611c42ec34fefdf2be2fd/movies.csv';

function processLine(pq) {
  return (line) => {
    // log.info(line);
    const parts = line.split(',');
    if (parts[0] === 'id') return;
    pq.enq({ id: parts[0], running_time: parts[1], rating: parts[2] });
    if (pq.size() > 10) { pq.deq(); }
  };
}

function ranking() {
  return new Promise(
    (resolve) => {
      const pq = new Priorityqueue((a, b) => b.rating - a.rating);

      const lineReader = readline.createInterface({
        // input: fs.createReadStream('./data.csv'),
        input: request.get(url),
      });

      lineReader.on('line', processLine(pq));

      lineReader.on('close', () => resolve(pq));
    }
  );
}

const logResults = (result) => {
  result.forEach(item => log.info(item));
};

ranking()
.then(logResults);
