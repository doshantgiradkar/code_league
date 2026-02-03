// socket.io docs: https://socket.io/docs/v4/server-api/
// https://socket.io/docs/v4/handling-cors/

import express from 'express';
import { createServer } from 'node:http';
import { Socket } from 'socket.io';

const app = express();
const server = createServer(app);

const io = Socket(server, {
  cors: {
    origin: '*', // allow all origins
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});