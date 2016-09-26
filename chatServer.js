/**
 * Created by ben on 9/25/16.
 */
const bunyan = require('bunyan');

const log = bunyan.createLogger({ name: 'myapp' });

const net = require('net');

const clients = [];

// Send a message to all clients
const broadcast = (message, sender)=>{
  clients.forEach((client) => {
    // Don't want to send it to sender
    if (client === sender) return;
    client.write(message);
  });
  // Log it to the server output too
  log.info(message);
}

const server = net.createServer((socket) =>{
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`;
  clients.push(socket);

  socket.write(`Welcome ${socket.name}\n`);
  broadcast(`${socket.name} joined the chat\n`, socket);

  // Handle incoming messages from clients.
  socket.on('data', (data) => {
    broadcast(`${socket.name}> ${data}`, socket);
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(`${socket.name} left the chat.\n`);
  });


});

server.listen(5000);
log.info('Chat server running at port 5000\n');