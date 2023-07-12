const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: 'uploads/', // Destination folder where files will be uploaded
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // Limit file size to 25MB
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, PDF, MS Word, and Excel files are allowed.'), false); // Reject the file
    }
  },
});


// Handle file upload route
router.post('/upload', upload.array('files'), (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    res.status(400).send('No files uploaded.');
  } else {
    files.forEach(file => {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (fs.existsSync(filePath)) {
        console.log('File already exists:', file.filename);
      }
    });
    res.send('Files uploaded successfully.');
  }
});

// Handle file deletion route
router.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('An error occurred while deleting the file.');
      } else {
        console.log('File deleted:', filename);
        res.send('File deleted successfully.');
      }
    });
  } else {
    res.status(404).send('File not found.');
  }
});

// Handle file move route
router.post('/move', (req, res) => {
  const sourceFilename = req.body.sourceFilename;
  const destinationFolder = req.body.destinationFolder;

  const sourceFilePath = path.join(__dirname, '../uploads', sourceFilename);
  const destinationFilePath = path.join(__dirname, '../uploads', destinationFolder, sourceFilename);

  if (fs.existsSync(sourceFilePath)) {
    fs.mkdir(path.join(__dirname, '../uploads', destinationFolder), { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating destination folder:', err);
        res.status(500).send('An error occurred while moving the file.');
      } else {
        fs.rename(sourceFilePath, destinationFilePath, (err) => {
          if (err) {
            console.error('Error moving file:', err);
            res.status(500).send('An error occurred while moving the file.');
          } else {
            console.log('File moved:', sourceFilename);
            res.send('File moved successfully.');
          }
        });
      }
    });
  } else {
    res.status(404).send('Source file not found.');
  }
});

// Handle file rename route
router.put('/rename/:filename', (req, res) => {
  const oldFilename = req.params.filename;
  const newFilename = req.body.newFilename;

  const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
  const newFilePath = path.join(__dirname, '../uploads', newFilename);

  if (fs.existsSync(oldFilePath)) {
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        res.status(500).send('An error occurred while renaming the file.');
      } else {
        console.log('File renamed:', oldFilename, 'to', newFilename);
        res.send('File renamed successfully.');
      }
    });
  } else {
    res.status(404).send('File not found.');
  }
});

module.exports = router;
