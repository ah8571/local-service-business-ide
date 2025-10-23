// Basic Express server test
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running!' });
});

// Serve the main IDE page
app.get('/', (req, res) => {
    const idePath = path.join(__dirname, '../frontend/ide.html');
    console.log('Looking for IDE at:', idePath);
    res.sendFile(idePath);
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`🚀 Basic server running on port ${PORT}`);
    console.log(`📊 Available at: http://localhost:${PORT}`);
});