// If running in the production environment, load all the variables from .env file.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect('/');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});