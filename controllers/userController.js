const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
// Register a new user
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // Duplicate key error for the email field
            return res.status(400).json({ message: 'Email is already registered' });
        }

        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateJWTToken(user._id);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to generate JWT token (replace with your implementation)
const generateJWTToken = (userId) => {
    // Replace 'your-secret-key' with a strong and secret key
    const secretKey = process.env.JWT_SECRET;

    // Replace '1h' with the desired expiration time, for example, '1d' for one day
    const expiresIn = '1h';

    const token = jwt.sign({ userId }, secretKey, { expiresIn });
    return token;
};
module.exports = { registerUser, loginUser, generateJWTToken };
