const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Define users with their plain passwords (in a real app, only store hashes)
const users = [
    { username: 'ujwal', passwordPlain: '0003', passwordHash: '' },
    { username: 'sapchuhang', passwordPlain: '0011', passwordHash: '' },
    { username: 'kunjum', passwordPlain: '0002', passwordHash: '' },
    { username: 'amrita', passwordPlain: '0010', passwordHash: '' },
    { username: 'suman', passwordPlain: '0004', passwordHash: '' }
];

const saltRounds = 10;

// Initialize all users
const initUsers = async () => {
    const promises = users.map(async (user) => {
        try {
            const hash = await bcrypt.hash(user.passwordPlain, saltRounds);
            user.passwordHash = hash;
            console.log(`User initialized: ${user.username}`);
        } catch (err) {
            console.error(`Error initializing user ${user.username}:`, err);
        }
    });
    
    await Promise.all(promises);
    console.log('All user credentials secure and ready.');
};

initUsers();

// Middleware to parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: 'suyogya_secret_key_change_this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static assets acting as public (images, css)
// Allowing these to be public so the login page can use them
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Login Route (GET)
app.get('/login', (req, res) => {
    if (req.session.authenticated) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Login Route (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    
    if (user) {
        const match = await bcrypt.compare(password, user.passwordHash);
        if (match) {
            req.session.authenticated = true;
            req.session.user = user;
            return res.redirect('/');
        }
    }
    
    // Simple error handling: redirect back to login with query param (could be improved)
    res.redirect('/login?error=1');
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// Authentication Middleware
function checkAuth(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Protect all following routes
app.use(checkAuth);

// Serve Index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve Pages folder
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
