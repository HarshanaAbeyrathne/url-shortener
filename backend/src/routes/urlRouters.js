import { Router } from 'express';
// import { createShortUrl, redirectByCode, getStats } from '../controllers/url.controller.js';

import { checkHealth, createShortUrl, redirectUrl, urlStats, checkShortUrl } from '../controllers/urlController.js';

const router = Router();


router.get('/health', checkHealth);
router.post('/shorten', createShortUrl);
router.get('/r/:code', redirectUrl);
router.get('/stats/:code', urlStats);
router.get('/:code', checkShortUrl);

export default router;