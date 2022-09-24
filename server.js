// If running in the production environment, load all the variables from .env file.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  // Send the 404 status code if the url does not exist.
  if (shortUrl == null) {
    res.sendStatus(404);
  }

  // Increment the number of clicks by one.
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.post('/shortUrls', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });
  } catch (e) {
    console.error(e.message);
  }
  res.redirect('/');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});