const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = process.env;
console.log( RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)
const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
});

module.exports = limiter;
