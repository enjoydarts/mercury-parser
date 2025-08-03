const express = require('express');
const Mercury = require('@postlight/mercury-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/parse', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing URL' });

    try {
        const result = await Mercury.parse(url);
        res.json({
            title: result.title,
            content: result.content,
            date_published: result.date_published,
            lead_image_url: result.lead_image_url,
            url: result.url,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Mercury Parser API is running on port ${port}`);
});
