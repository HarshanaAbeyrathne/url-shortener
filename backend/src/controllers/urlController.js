import e from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
// import client from './config/redisClient.js';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:4002');

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost';

export const checkHealth = (req, res) => {
  res.json({ ok: true, service: 'url-shortener-backend' });
};

// POST /api/shorten  { "longUrl": "https://example.com/very/long/path" }
export const createShortUrl = async (req, res) => {
  try {
      const { longUrl } = req.body;
      if (!longUrl || typeof longUrl !== 'string') {
        return res.status(400).json({ error: 'longUrl is required' });
      }
  
      // create short code
      const code = nanoid(7);
  
      // save mapping
      await redis.set(`url:${code}`, longUrl);
  
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
}

// GET /r/:code -> 302 redirect to original long URL
export const redirectUrl = async (req, res) => {
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
}

export const urlStats = async (req, res) => {
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
}

//GET /api/url/:code this one for my testing
export const checkShortUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const value = await redis.get(`url:${code}`);
    if (!value) return res.status(404).json({ message: 'Not found' });

    res.json({ code, longUrl: value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
};



export default {
  checkHealth, createShortUrl, redirectUrl, urlStats, checkShortUrl
};