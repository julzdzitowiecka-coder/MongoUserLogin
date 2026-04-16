const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const secretKey =  process.env.JWT_SECRET || "default_secret_key"; 

app.use(express.json());

// Sample user data (Replace with your database or actual authentication logic)
const users = [];

// Endpoint for user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'Missing fields' });
    // Check if the username already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Add new user to the database
    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword
    };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
});

// Endpoint for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return res.status(401).json({ message: "Invalid credentials" });
    // User authenticated, generate token
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "1h" });
    res.json({ token });

});

// Protected route example (Dashboard access)
app.get('/dashboard', verifyToken, (req, res) => {
    // Return dashboard data or user-specific information
    res.json({ message: 'Welcome to the Customer Portal!' });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, authData) => {
        if (err) return res.sendStatus(403);
        req.authData = authData;
        next();
    });
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
