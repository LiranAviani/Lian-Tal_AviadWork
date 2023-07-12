const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Handle getting all folders route
router.get('/', (req, res) => {
  const folderPath = path.join(__dirname, '..', 'uploads');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folders:', err);
      res.status(500).send('An error occurred while fetching folders.');
    } else {
      const folders = files.filter((file) => {
        const folderFullPath = path.join(folderPath, file);
        return fs.statSync(folderFullPath).isDirectory();
      });
      res.send(folders);
    }
  });
});

// Handle folder creation route
router.post('/create', (req, res) => {
  const folderName = req.body.folderName; // Assuming the folder name is passed in the request body

  const folderPath = path.join(__dirname, '..', 'uploads', folderName);

  if (fs.existsSync(folderPath)) {
    res.status(400).send('Folder already exists.');
  } else {
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating folder:', err);
        res.status(500).send('An error occurred while creating the folder.');
      } else {
        console.log('Folder created:', folderName);
        res.send('Folder created successfully.');
      }
    });
  }
});

// Handle folder deletion route
router.delete('/delete/:folderName', (req, res) => {
  const folderName = req.params.folderName;
  const folderPath = path.join(__dirname, '..', 'uploads', folderName);
  if (fs.existsSync(folderPath)) {
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error deleting folder:', err);
        res.status(500).send('An error occurred while deleting the folder.');
      } else {
        console.log('Folder deleted:', folderName);
        res.send('Folder deleted successfully.');
      }
    });
  } else {
    res.status(404).send('Folder not found.');
  }
});

// Handle folder move route
router.post('/move', (req, res) => {
  const sourceFolderName = req.body.sourceFolderName; // Assuming the source folder name is passed in the request body
  const destinationFolderName = req.body.destinationFolderName; // Assuming the destination folder name is passed in the request body

  const sourceFolderPath = path.join(__dirname, '..', 'uploads', sourceFolderName);
  const destinationFolderPath = path.join(__dirname, '..', 'uploads', destinationFolderName, sourceFolderName);

  if (fs.existsSync(sourceFolderPath)) {
    // Create the destination folder if it doesn't exist
    fs.mkdir(path.join(__dirname, '..', 'uploads', destinationFolderName), { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating destination folder:', err);
        res.status(500).send('An error occurred while moving the folder.');
      } else {
        fs.rename(sourceFolderPath, destinationFolderPath, (err) => {
          if (err) {
            console.error('Error moving folder:', err);
            res.status(500).send('An error occurred while moving the folder.');
          } else {
            console.log('Folder moved:', sourceFolderName);
            res.send('Folder moved successfully.');
          }
        });
      }
    });
  } else {
    res.status(404).send('Source folder not found.');
  }
});

// Handle folder rename route
router.put('/rename/:folderName', (req, res) => {
  const oldFolderName = req.params.folderName;
  const newFolderName = req.body.newFolderName; // Assuming the new folder name is passed in the request body

  const oldFolderPath = path.join(__dirname, '..', 'uploads', oldFolderName);
  const newFolderPath = path.join(__dirname, '..', 'uploads', newFolderName);

  if (fs.existsSync(oldFolderPath)) {
    fs.rename(oldFolderPath, newFolderPath, (err) => {
      if (err) {
        console.error('Error renaming folder:', err);
        res.status(500).send('An error occurred while renaming the folder.');
      } else {
        console.log('Folder renamed:', oldFolderName, 'to', newFolderName);
        res.send('Folder renamed successfully.');
      }
    });
  } else {
    res.status(404).send('Folder not found.');
  }
});

module.exports = router;
