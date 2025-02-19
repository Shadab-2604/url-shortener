const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// URL Schema
const urlSchema = new mongoose.Schema({
    shortUrl: String,
    longUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

// Shorten URL
app.post('/shorten', async (req, res) => {
    const longUrl = req.body.longUrl;
    const shortUrl = shortid.generate();

    // Save to MongoDB
    const newUrl = new Url({ shortUrl, longUrl });
    await newUrl.save();

    // Dynamic base URL
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : `http://localhost:${port}`;

    res.json({ shortUrl: `${baseUrl}/${shortUrl}` });
});

// Redirect to original URL
app.get('/:shortUrl', async (req, res) => {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (url) {
        res.redirect(url.longUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});