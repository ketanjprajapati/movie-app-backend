const mongoose = require('mongoose');
const Movie = require('../models/movieModel');

describe('Movie Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/movieDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create and save a new movie successfully', async () => {
        const movieData = {
            title: 'Inception',
            director: 'Christopher Nolan',
            genre: 'Sci-Fi',
            releaseYear: 2010,
            rating: 8.8,
        };

        const movie = new Movie(movieData);
        const savedMovie = await movie.save();

        expect(savedMovie._id).toBeDefined();
        expect(savedMovie.title).toBe(movieData.title);
        expect(savedMovie.director).toBe(movieData.director);
        expect(savedMovie.genre).toBe(movieData.genre);
        expect(savedMovie.releaseYear).toBe(movieData.releaseYear);
        expect(savedMovie.rating).toBe(movieData.rating);
    });

    it('should not save a movie without required fields', async () => {
        const movieWithoutRequiredField = new Movie({ title: 'Inception' });
        let err;

        try {
            await movieWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});
