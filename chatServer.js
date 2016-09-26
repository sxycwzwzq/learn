/**
 * Created by ben on 9/25/16.
 */
const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'myapp' });

const net = require('net');

const clients = [];

const broadcast = (message, sender) => {
  clients.forEach((client) => {
    if (client === sender) return;
    client.write(message);
  });
  log.info(message);
};

const server = net.createServer((socket) => {
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`;
  clients.push(socket);

  socket.write(`Welcome ${socket.name}\n`);
  broadcast(`${socket.name} joined the chat\n`, socket);

  socket.on('data', (data) => {
    broadcast(`${socket.name}> ${data}`, socket);
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(`${socket.name} left the chat.\n`);
  });
});

server.listen(5000);
log.info('Chat server running at port 5000\n');
