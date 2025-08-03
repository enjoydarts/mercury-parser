import express from 'express';
import got from 'got';
import Mercury from '@postlight/mercury-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" in request body' });
    }

    try {
        // gotでUTF-8として自動解釈
        const html = await got(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0 Safari/537.36',
            },
            responseType: 'text',
            resolveBodyOnly: true,
        });

        // Mercuryでパース
        const result = await Mercury.parse(url, { content: html });

        if (!result || !result.content) {
            return res.status(500).json({ error: 'Parse failed', detail: 'No content returned' });
        }

        return res.json({
            title: result.title,
            content: result.content,
            date_published: result.date_published,
            lead_image_url: result.lead_image_url,
            url: result.url,
        });
    } catch (err) {
        console.error('Parse error:', err);
        return res.status(500).json({ error: 'Parse failed', detail: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
