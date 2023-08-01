const express = require('express');
const path = require('path');

const router = express.Router();
const fs = require('fs/promises');

const filePath = path.join(__dirname, '../data/cards.json');

// gets
router.get('/', (req, res) => {
  fs.readFile(filePath)
    .then((fileData) => {
      res.send(JSON.parse(fileData));
    })
    .catch(() => {
      res.status(500).send({ message: 'An error has occurred on  the server' });
    });
});

module.exports = router;
