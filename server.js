const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = {};

app.use(express.static(path.join(__dirname, 'public'))); // Serves HTML/JS/CSS

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const room = data.roomCode;
    ws.roomCode = room;

    if (data.type === 'join') {
      if (!rooms[room]) rooms[room] = [];
      rooms[room].push(ws);

      if (rooms[room].length === 2) {
        rooms[room].forEach(client => {
          client.send(JSON.stringify({ type: 'start' }));
        });
      }
    }

    if (data.type === 'button') {
      // Relay button click (yes/no) to the other player
      if (rooms[room]) {
        rooms[room].forEach(client => {
          if (client !== ws) {
            client.send(JSON.stringify({ type: 'button', value: data.value }));
          }
        });
      }
    }
  });

  ws.on('close', () => {
    const room = ws.roomCode;
    if (room && rooms[room]) {
      rooms[room] = rooms[room].filter(client => client !== ws);
      if (rooms[room].length === 0) delete rooms[room];
    }
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server running');
});
