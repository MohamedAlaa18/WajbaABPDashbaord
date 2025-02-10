const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const buildPath = path.join(__dirname, 'dist', 'Wajba');
console.log('Serving static files from:', buildPath);

fs.readdir(buildPath, (err, files) => {
  if (err) {
    console.error('Directory not found:', err);
  } else {
    console.log('Directory contents:', files);
  }
});

// Serve only the static files from the dist directory
app.use(express.static(buildPath));

app.get('/*', function (req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start the app by listening on the default Heroku port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
