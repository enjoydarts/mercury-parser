const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const iconv = require('iconv-lite');
const jschardet = require('jschardet');
const Mercury = require('@postlight/mercury-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// UTF-8 かどうか判定して読み込み
const fetchWithEncoding = (url) =>
    new Promise((resolve, reject) => {
        const options = {
            url,
            encoding: null, // Buffer で受け取る
            timeout: 10000,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            },
        };

        request.get(options, (error, response, body) => {
            if (error) return reject(error);

            const detected = jschardet.detect(body);
            const encoding = detected.encoding || 'UTF-8';
            const decoded = iconv.decode(body, encoding);

            resolve(decoded);
        });
    });

app.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: 'Missing URL' });

    try {
        const html = await fetchWithEncoding(url);
        const result = await Mercury.parse(url, { html });

        res.json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            error: 'Parse failed',
            detail: err.message || err.toString(),
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
