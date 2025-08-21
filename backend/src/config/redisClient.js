// config/redisClient.js
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:4002"
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect only once when the app starts
await client.connect();
console.log('✅ Redis connected successfully');

export default client;
