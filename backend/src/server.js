import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { nanoid } from "nanoid";
import cors from 'cors';



import urlRouter from './routes/urlRouters.js';



dotenv.config();



const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // allow your frontend
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));


const PORT = process.env.PORT || 3000;


// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use('/api/url', urlRouter);


app.listen(PORT, () => console.log(`Backend listening on : ${PORT}`));




import client from './config/redisClient.js';

// const checkRedis = async () => {
//   try {
//     const pong = await client.ping(); // Sends "PING"
//     console.log('Redis PING response:', pong); // Should be "PONG"
//   } catch (err) {
//     console.error('Redis check failed:', err);
//   }
// };

// checkRedis();











// POST /api/shorten  { "longUrl": "https://example.com/very/long/path" }
// app.post('/api/shorten', async (req, res) => {
//   try {
//     const { longUrl } = req.body;
//     if (!longUrl || typeof longUrl !== 'string') {
//       return res.status(400).json({ error: 'longUrl is required' });
//     }

//     // create short code
//     const code = nanoid(7);

//     // save mapping
//     // await redis.set(`url:${code}`, longUrl);

//     // (optional) basic analytics counter
//     // await redis.set(`clicks:${code}`, 0);

//     // return short link
//     const shortUrl = `${BASE_URL}/r/${code}`;
//     res.status(201).json({ code, shortUrl, longUrl });
//     // res.status(201).json({ code});

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'server_error' });
//   }
// });

// // GET /r/:code -> 302 redirect to original long URL
// app.get('/r/:code', async (req, res) => {
//   try {
//     const { code } = req.params;
//     const key = `url:${code}`;
//     const longUrl = await redis.get(key);

//     if (!longUrl) {
//       return res.status(404).send('Not found');
//     }

//     // increment clicks
//     await redis.incr(`clicks:${code}`);

//     // redirect
//     return res.redirect(302, longUrl);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('server_error');
//   }
// });

// (optional) GET /api/stats/:code -> { clicks }
// app.get('/api/stats/:code', async (req, res) => {
//   try {
//     const { code } = req.params;
//     const exists = await redis.get(`url:${code}`);
//     if (!exists) return res.status(404).json({ error: 'not_found' });

//     const clicks = parseInt(await redis.get(`clicks:${code}`) || '0', 10);
//     res.json({ code, clicks });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'server_error' });
//   }
// });


