const backendURL = 'https://pool-69rx.onrender.com'; // Replace with your Render backend URL

let wins = {};
let history = {};

// Toggle the burger menu visibility
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
}

// Add a new player
function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName && !Object.keys(wins).includes(playerName)) {
        wins[playerName] = 0;
        updatePlayerList();
        document.getElementById("playerName").value = "";
        saveWins(); // Save updated wins to the backend
    }
}

// Update the player list
function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = Object.keys(wins)
        .map(player => `<li>${player}</li>`)
        .join("");
}

// Start the game
function startGame() {
    alert("Game Started!"); // Add your game logic here
}

// Update the scoreboard with today's win counts
function updateScoreboard() {
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = Object.entries(wins)
        .map(([player, winCount]) => `<li>${player}: ${winCount} 🏆</li>`)
        .join("");
}

// Update the history page
function updateHistoryPage() {
    const historyRecords = document.getElementById("historyRecords");
    historyRecords.innerHTML = Object.entries(history)
        .map(([date, dailyWins]) => {
            const playerRecords = Object.entries(dailyWins)
                .map(([player, winCount]) => `<li>${player}: ${winCount} 🏆</li>`)
                .join("");
            return `<div>
                        <h3>${date}</h3>
                        <ul>${playerRecords}</ul>
                    </div>`;
        })
        .join("");
}

// Fetch wins and history from the backend
async function loadWins() {
    const response = await fetch(backendURL);
    const data = await response.json();
    wins = data.wins || {};
    history = data.history || {};
    updateScoreboard();
}

// Save wins and history to the backend
async function saveWins() {
    await fetch(backendURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newWins: wins, newHistory: history }),
    });
}

// Initialize the app
loadWins();
