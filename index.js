const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


app.post('/save-en', (req, res) => {
  saveDataToFile(req.body, 'sentences_en.json', res);
});


app.post('/save-sv', (req, res) => {
  saveDataToFile(req.body, 'sentences_sv.json', res);
});


function saveDataToFile(newData, filePath, res) {
  // Skriv den nya datan direkt till filen
  fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      res.status(500).json({ error: 'Error writing to file' });
      return;
    }

    console.log('File completely overwritten with new data');
    res.json({ message: 'File completely overwritten with new data' });
  });
}

app.listen(port, () => {
  console.log(`Servern lyssnar på port ${port}`);
});
