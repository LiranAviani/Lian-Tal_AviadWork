const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();

// Add middleware to parse the request body as JSON
app.use(express.json());

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Serve static files in the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import file routes
const fileRoute = require('./routes/fileRoute');
app.use('/file', fileRoute);

// Import folder routes
const folderRoute = require('./routes/folderRoute');
app.use('/folder', folderRoute);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
