const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const errorHandler = require('./middleware/errorHandling');
require('dotenv').config();

const { PORT, MONGODB_URI } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

app.use('/api/users', userRoutes);
app.use('/api', movieRoutes);
app.use(errorHandler);

// comment this lines while check testcases
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// uncomment this line while check test
// module.exports = app;