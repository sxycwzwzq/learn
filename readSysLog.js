const fs = require('fs');

const readline = require('readline');

const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'myapp' });

function readlog() {
  return new Promise(
    (resolve) => {
      const lineReader = readline.createInterface({
        input: fs.createReadStream('/var/log/system.log'),
      });

      lineReader.on('line', (line) => {
        if (line.indexOf('error') !== -1) {
          log.info(line);
        }
      });

      lineReader.on('close', () => resolve());
    }
  );
}

readlog()
.then(() => {
  log.info('done');
  process.exit(0);
})
.catch((err) => {
  log.info(err.message);
  process.exit(-1);
});
