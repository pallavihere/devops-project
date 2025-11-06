const express = require('express');
const path = require('path');
const { Server } = require('ws');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Create a new database file
const db = new sqlite3.Database('./chat.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chat database.');
});

// Create a messages table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, text TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the API endpoint
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Dockerized CI/CD pipeline!' });
});

const server = app.listen(port, () => {
  console.log(`MessageApp listening at http://localhost:${port}`);
});

// Create a WebSocket server
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send the last 20 messages to the new client
  db.all('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20', (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      rows.reverse().forEach((row) => {
        ws.send(JSON.stringify(row));
      });
    }
  });

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const parsedMessage = JSON.parse(message);

    // Insert the message into the database
    db.run('INSERT INTO messages (author, text) VALUES (?, ?)', [parsedMessage.author, parsedMessage.text], function(err) {
      if (err) {
        return console.error(err.message);
      }
      // Broadcast the message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(message.toString());
        }
      });
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
