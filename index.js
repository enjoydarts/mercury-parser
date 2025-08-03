const express = require('express');
const got = require('got');
const Mercury = require('@postlight/mercury-parser');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing URL' });

    try {
        // got で文字コード正しく取得
        const html = await got(url, {
            responseType: 'text',
            resolveBodyOnly: true,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const result = await Mercury.parse(url, { html });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Parse failed', detail: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
