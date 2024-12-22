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

// Add event listeners to close the menu when a button is clicked
document.querySelectorAll('#menu button').forEach(button => {
    button.addEventListener('click', closeMenu);
});

// Global Variables
let players = [];
let currentPlayers = [];
let currentIndex = 0;
let wins = {};

// Add a new player
function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName && !players.some(player => player.name === playerName)) {
        players.push({ name: playerName });
        wins[playerName] = wins[playerName] || 0; // Initialize wins
        updatePlayerList();
        document.getElementById("playerName").value = "";
    }
}

// Update the player list
function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = players
        .map((player, index) => `<li>${player.name}</li>`)
        .join("");
}

// Start the game
function startGame() {
    if (players.length < 2) {
        alert("At least two players are required to start the game.");
        return;
    }

    // Initialize game state
    currentPlayers = players.map(player => ({ name: player.name, lives: 3 }));
    currentIndex = 0;

    // Hide setup and show game area
    document.getElementById("setup").classList.add("hidden");
    const gameArea = document.getElementById("game-area");
    gameArea.classList.remove("hidden");

    // Scroll smoothly to the game area
    gameArea.scrollIntoView({ behavior: "smooth" });

    updateGameUI();
}

// Update the game UI
function updateGameUI() {
    const currentPlayer = currentPlayers[currentIndex];
    document.getElementById("currentPlayer").textContent = currentPlayer.name;

    const livesList = document.getElementById("livesList");
    livesList.innerHTML = currentPlayers
        .map(player => `<li>${player.name}: ${"❤️".repeat(player.lives)}</li>`)
        .join("");
}

// Gameplay Actions
function pot() {
    nextPlayer();
}

function miss() {
    currentPlayers[currentIndex].lives--;
    if (currentPlayers[currentIndex].lives <= 0) {
        alert(`${currentPlayers[currentIndex].name} is out!`);
        currentPlayers.splice(currentIndex, 1);
        if (currentIndex >= currentPlayers.length) currentIndex = 0;
    }
    nextPlayer();
}

function bonus() {
    currentPlayers[currentIndex].lives++;
    nextPlayer();
}

function shuffleOrder() {
    currentPlayers.sort(() => Math.random() - 0.5);
    updateGameUI();
    alert("Player order shuffled!");
}

function nextPlayer() {
    if (currentPlayers.length === 1) {
        alert(`${currentPlayers[0].name} wins!`);
        resetGamePage();
        return;
    }
    currentIndex = (currentIndex + 1) % currentPlayers.length;
    updateGameUI();
}

// Reset the game page
function resetGamePage() {
    document.getElementById("setup").classList.remove("hidden");
    document.getElementById("game-area").classList.add("hidden");
    currentPlayers = [];
    currentIndex = 0;
}
