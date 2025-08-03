const express = require('express');
const bodyParser = require('body-parser');
const Mercury = require('@postlight/mercury-parser').default; // ← 修正ポイント

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '1mb' }));

app.post('/', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const result = await Mercury.parse(url);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Parse failed', detail: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
