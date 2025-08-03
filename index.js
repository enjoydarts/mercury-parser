const express = require('express');
const Mercury = require('@postlight/mercury-parser');
const got = require('got');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" in request body' });
    }

    try {
        // HTMLをgotで取得
        const html = await got(url).text();

        // Mercuryに生HTMLを渡してパース
        const result = await Mercury.parse(url, { html });

        res.json(result);
    } catch (err) {
        console.error('Parse failed:', err);
        res.status(500).json({ error: 'Parse failed', detail: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
