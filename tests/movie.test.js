const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { generateValidToken } = require('../controllers/userController')
const dummyMovie = {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    releaseYear: 2010,
    rating: 8.8,
};

describe('Movie API Endpoints', () => {
    let server;
    let token;
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/movieDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server = app.listen(3000);
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });

    // user route test
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
    it('should handle duplicate email during registration', async () => {
        const res1 = await request(app)
            .post('/api/users/register')
            .send({
                email: 'duplicate2@example.com',
                password: 'password123',
            });

        const res2 = await request(app)
            .post('/api/users/register')
            .send({
                email: 'duplicate2@example.com',
                password: 'password456',
            });

        expect(res1.statusCode).toEqual(201);
        expect(res1.body).toHaveProperty('message', 'User registered successfully');

        expect(res2.statusCode).toEqual(400);
        expect(res2.body).toHaveProperty('message', 'Email is already registered');
    });
    it('should login a registered user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token; // Store the token for further requests
    });

    it('should handle invalid credentials during login', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'nonexistent@example.com', password: 'invalidPassword' });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });


    // movie route tests
    it('should create a new movie', async () => {
        const res = await request(app)
            .post('/api/movies')
            .set('Authorization', `${token}`)
            .send(dummyMovie);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe(dummyMovie.title);
    });


    it('should get all movies', async () => {
        const res = await request(app).get('/api/movies').set('Authorization', `${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get a single movie by ID', async () => {
        const createdMovie = (await request(app).post('/api/movies').set('Authorization', `${token}`).send(dummyMovie)).body;

        const res = await request(app).get(`/api/movies/${createdMovie._id}`).set('Authorization', `${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', createdMovie._id);
    });

    it('should update a movie by ID', async () => {
        const createdMovie = (await request(app).post('/api/movies').set('Authorization', `${token}`).send(dummyMovie)).body;

        const updatedMovieData = {
            title: 'Updated Inception',
            director: 'Updated Christopher Nolan',
            genre: 'Updated Sci-Fi',
            releaseYear: 2022,
            rating: 9.0,
        };

        const res = await request(app).put(`/api/movies/${createdMovie._id}`).set('Authorization', `${token}`).send(updatedMovieData);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', createdMovie._id);
        expect(res.body.title).toBe(updatedMovieData.title);
    });

    it('should delete a movie by ID', async () => {
        const createdMovie = (await request(app).post('/api/movies').set('Authorization', `${token}`).send(dummyMovie)).body;

        const res = await request(app).delete(`/api/movies/${createdMovie._id}`).set('Authorization', `${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', createdMovie._id);
    });
});
