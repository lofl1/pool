const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let wins = {}; // Stores today's wins
let history = {}; // Stores historical win records by date

// Utility function to get today's date
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Fetch current wins and history
app.get('/api/data', (req, res) => {
    res.json({ wins, history });
});

// Update wins and history
app.post('/api/data', (req, res) => {
    const { newWins, newHistory } = req.body;
    wins = newWins || wins;
    history = newHistory || history;

    // Save today's wins into history
    const today = getTodayDate();
    history[today] = { ...wins };

    res.json({ message: 'Data updated successfully' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
