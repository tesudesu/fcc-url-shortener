require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
 
mongoose.connect(process.env.MONGO_URI);

const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Substantive part of my code begins here

const urlSchema = new mongoose.Schema({
  url: String
});

let Url = mongoose.model('Url', urlSchema);

// console.log(dns.lookup('www.google.com', (err, address, family) => {
//   if (err) {
//     console.log(err)
//   }
//   console.log(err)
//   console.log(address)
//   console.log(family)
// }))

// app.post('/api/shorturl', function (req, res) {
//   if (!/^https?:\/\//.test(req.body.url)) {
//     return res.json({ error: 'invalid url' }) 
//   }
//   dns.lookup(req.body.url.replace(/https?:\/\//, '').replace(/[^A-Za-z]*$/, ''), (err, address, family) => {
//     if (err) {
//       return res.json({ error: 'invalid url' })
//     } else {
//       const newUrl = new Url({ url: req.body.url });
//       newUrl.save((err, data) => {
//         if (err) {
//           return console.log(err);
//         }
//         res.json({ original_url: data.url, short_url: data.id });
//       });
//     }
//   })
// });

app.post('/api/shorturl', function (req, res) {
  if (!/^https?:\/\//.test(req.body.url)) {
    return res.json({ error: 'invalid url' }) 
  }
  const newUrl = new Url({ url: req.body.url });
  newUrl.save((err, data) => {
    if (err) {
      return console.log(err);
    }
    res.json({ original_url: data.url, short_url: data.id });
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id;
  Url.findById(id, (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.redirect(data.url);
  });
});

// Substantive part of my code ends here

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
