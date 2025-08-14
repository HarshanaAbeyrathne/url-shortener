import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';

import urlRouter from './routes/urlRouters.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', urlRouter);

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL || 'http://localhost';

// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');



// health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'url-shortener-backend' });
});

// POST /api/shorten  { "longUrl": "https://example.com/very/long/path" }
app.post('/api/shorten', async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl || typeof longUrl !== 'string') {
      return res.status(400).json({ error: 'longUrl is required' });
    }

    // create short code
    const code = nanoid(7);

    // save mapping
    // await redis.set(`url:${code}`, longUrl);

    // (optional) basic analytics counter
    // await redis.set(`clicks:${code}`, 0);

    // return short link
    const shortUrl = `${BASE_URL}/r/${code}`;
    res.status(201).json({ code, shortUrl, longUrl });
    // res.status(201).json({ code});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

// GET /r/:code -> 302 redirect to original long URL
app.get('/r/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const key = `url:${code}`;
    const longUrl = await redis.get(key);

    if (!longUrl) {
      return res.status(404).send('Not found');
    }

    // increment clicks
    await redis.incr(`clicks:${code}`);

    // redirect
    return res.redirect(302, longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('server_error');
  }
});

// (optional) GET /api/stats/:code -> { clicks }
app.get('/api/stats/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const exists = await redis.get(`url:${code}`);
    if (!exists) return res.status(404).json({ error: 'not_found' });

    const clicks = parseInt(await redis.get(`clicks:${code}`) || '0', 10);
    res.json({ code, clicks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

app.listen(PORT, () => console.log(`Backend listening on : ${PORT}`));
