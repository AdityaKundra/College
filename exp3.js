const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the signup form
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/signup', (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  // Store data in a file
  fs.appendFile('data.json', JSON.stringify(userData) + '\n', (err) => {
    if (err) throw err;
    console.log('User data saved!');
  });

  res.send('Signup successful!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
