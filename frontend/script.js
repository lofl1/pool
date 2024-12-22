// Toggle the burger menu visibility
function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
}

// Function to close the burger menu
function closeMenu() {
    const menu = document.getElementById("menu");
    if (!menu.classList.contains("hidden")) {
        menu.classList.add("hidden");
    }
}

// Add event listeners to close the menu when a button is clicked
document.querySelectorAll('#menu button').forEach(button => {
    button.addEventListener('click', closeMenu);
});

// Global Variables
let players = [];       // Main player list (persists across sessions)
let currentPlayers = []; // Active players in the current game
let currentIndex = 0;   // Tracks whose turn it is
let wins = {};          // Persistent wins tracking

// Add a new player
function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName && !players.some(player => player.name === playerName)) {
        players.push({ name: playerName });
        wins[playerName] = wins[playerName] || 0; // Initialize wins if not already
        updatePlayerList();
        document.getElementById("playerName").value = "";
    }
}

// Remove a player
function removePlayer(index) {
    const playerName = players[index].name;
    players.splice(index, 1);
    updatePlayerList();
}

// Update the player list (with delete buttons)
function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = players
        .map((player, index) =>
            `<li>${player.name} 
             <button onclick="removePlayer(${index})">❌ Delete</button>
             </li>`)
        .join("");
}

// Start the game
function startGame() {
    if (players.length < 2) {
        alert("At least two players are required to start the game.");
        return;
    }
    // Prepare a new list of players for the current game
    currentPlayers = players.map(player => ({ name: player.name, lives: 3 }));
    currentIndex = 0; // Start with the first player

    // Hide the setup section & "Play Game" heading
    document.getElementById("setup").classList.add("hidden");
    document.querySelector("#game h2").classList.add("hidden");

    // Show the current player banner and the game area
    document.getElementById("currentPlayerBanner").classList.remove("hidden");
    document.getElementById("game-area").classList.remove("hidden");

    updateGameUI();

    // Optional: scroll to the game area
    document.getElementById("game-area").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Update the game UI (current player, hearts, etc.)
function updateGameUI() {
    if (currentPlayers.length === 0) {
        resetGamePage();
        return;
    }

    // Show the current player's name in the banner
    const currentPlayer = currentPlayers[currentIndex];
    document.getElementById("currentPlayer").textContent = currentPlayer.name;

    // Build the lives list
    const livesList = document.getElementById("livesList");
    livesList.innerHTML = currentPlayers
        .map((player, index) => {
            const highlightClass = (index === currentIndex) ? 'highlight' : '';
            return `<li class="${highlightClass}">
                        ${player.name}: ${"❤️".repeat(player.lives)}
                    </li>`;
        })
        .join("");
}

// Shuffle the player order
function shuffleOrder() {
    currentPlayers.sort(() => Math.random() - 0.5);
    updateGameUI();
    alert("Player order has been shuffled!");
}

// Move to next player
function nextPlayer() {
    currentIndex = (currentIndex + 1) % currentPlayers.length;

    // Check if only one player remains
    if (currentPlayers.length === 1) {
        const winner = currentPlayers[0].name;
        wins[winner]++;
        updateScoreboard();
        alert(`${winner} wins! 🎉`);
        resetGamePage();
        showPage('wins');
    } else {
        updateGameUI();
    }
}

// Pot (successful shot)
function pot() {
    nextPlayer();
}

// Miss (lose a life)
function miss() {
    currentPlayers[currentIndex].lives--;
    if (currentPlayers[currentIndex].lives <= 0) {
        alert(`${currentPlayers[currentIndex].name} is out! ❌`);
        currentPlayers.splice(currentIndex, 1);
        if (currentIndex >= currentPlayers.length) {
            currentIndex = 0;
        }
    }
    nextPlayer();
}

// Bonus (gain a life)
function bonus() {
    currentPlayers[currentIndex].lives++;
    nextPlayer();
}

// Reset the "Play Game" page but keep player names & wins
function resetGamePage() {
    // Show the "Play Game" heading again
    document.querySelector("#game h2").classList.remove("hidden");
    // Show the setup section
    document.getElementById("setup").classList.remove("hidden");
    // Hide the current player banner and game area
    document.getElementById("currentPlayerBanner").classList.add("hidden");
    document.getElementById("game-area").classList.add("hidden");
    document.getElementById("livesList").innerHTML = "";
    currentIndex = 0;
    currentPlayers = [];
}

// Update the scoreboard with sorted wins
function updateScoreboard() {
    const sortedWins = Object.entries(wins)
        .sort(([, a], [, b]) => b - a) // descending by win count
        .map(([player, winCount]) => ({ player, winCount }));

    document.getElementById("scoreboard").innerHTML = sortedWins
        .map(({ player, winCount }) => `<li>${player}: ${winCount} 🏆</li>`)
        .join("");
}

// Show a specific page (home, game, wins, etc.)
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    if (pageId === 'wins') {
        updateScoreboard();
    }
}
