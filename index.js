// server.js
const express = require('express');
const request = require('request');
const iconv = require('iconv-lite');
const jschardet = require('jschardet');
const { Mercury } = require('@postlight/mercury-parser');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing URL' });

    request({ url, encoding: null }, async (err, response, body) => {
        if (err || !body) return res.status(500).json({ error: 'Request failed' });
        const encoding = jschardet.detect(body).encoding || 'utf-8';
        const html = iconv.decode(body, encoding);

        try {
            const result = await Mercury.parse(url, { content: html });
            res.json(result);
        } catch (parseErr) {
            res.status(500).json({ error: 'Parse failed', detail: parseErr.message });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
