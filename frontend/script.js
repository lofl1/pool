const backendURL = 'https://pool-69rx.onrender.com'; // Replace with your Render backend URL

let wins = {};
let history = {};

// Toggle the burger menu visibility
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
}

// Close the burger menu
function closeMenu() {
    const menu = document.getElementById("menu");
    menu.classList.add("hidden");
}

// Show a specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));

    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.error(`Page with ID "${pageId}" not found`);
    }
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
    try {
        const response = await fetch(`${backendURL}/api/data`);
        const data = await response.json();
        wins = data.wins || {};
        history = data.history || {};
        updateScoreboard();
    } catch (error) {
        console.error("Failed to load data from backend:", error);
    }
}

// Save wins and history to the backend
async function saveWins() {
    try {
        await fetch(`${backendURL}/api/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newWins: wins, newHistory: history }),
        });
    } catch (error) {
        console.error("Failed to save data to backend:", error);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadWins();
});
