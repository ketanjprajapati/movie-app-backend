const mongoose = require('mongoose');
const Movie = require('../models/movieModel');
const getAllMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        next(error);
    }
};

const getMovieById = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Movie ID' });
    }
    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        next(error);
    }
};

const addMovie = async (req, res, next) => {
    const { title, director, genre, releaseYear, rating } = req.body;

    // Validate data
    if (!title || !director || !genre || !releaseYear || !rating) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newMovie = new Movie({
            title,
            director,
            genre,
            releaseYear,
            rating,
        });

        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        next(error);
    }
};

const updateMovie = async (req, res, next) => {
    const { id } = req.params;
    const { title, director, genre, releaseYear, rating } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Movie ID' });
    }
    // Validate data
    if (!title || !director || !genre || !releaseYear || !rating) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { title, director, genre, releaseYear, rating },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(updatedMovie);
    } catch (error) {
        next(error);
    }
};

const deleteMovie = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Movie ID' });
    }
    try {
        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json(deletedMovie);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
};
