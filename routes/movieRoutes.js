const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authenticationMiddleware = require('../middleware/authentication');
const rateLimitingMiddleware = require('../middleware/rateLimiting');

router.use(rateLimitingMiddleware);
router.use(authenticationMiddleware);

router.get('/movies', movieController.getAllMovies);
router.get('/movies/:id', movieController.getMovieById);
router.post('/movies', movieController.addMovie);
router.put('/movies/:id', movieController.updateMovie);
router.delete('/movies/:id', movieController.deleteMovie);

module.exports = router;
