const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the API endpoint
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Dockerized CI/CD pipeline!' });
});

app.listen(port, () => {
  console.log(`MessageApp listening at http://localhost:${port}`);
});
