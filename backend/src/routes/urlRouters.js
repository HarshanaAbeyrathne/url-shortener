import { Router } from 'express';
import { createShortUrl, redirectByCode, getStats } from '../controllers/url.controller.js';

const router = Router();


router.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'url-shortener-backend' });
});



// API endpoints
router.post('/shorten', createShortUrl);
router.get('/stats/:code', getStats);

// Public redirect endpoint (mounted at /r in server)
router.get('/r/:code', redirectByCode);

export default router;