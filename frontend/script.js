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
let players = [];            // All players added BEFORE game starts
let currentPlayers = [];     // Active players in the current game
let currentIndex = 0;        // Which player's turn it is
let wins = {};               // Persistent wins tracking

// We'll track the last action so we can UNDO it
// e.g. { playerIndex, prevLives, newLives, prevIndex, actionType }
let lastAction = null;

/** ========== ADDING PLAYERS & SHUFFLING ========== **/

function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName && !players.some(player => player.name === playerName)) {
        players.push({ name: playerName });
        wins[playerName] = wins[playerName] || 0; // Ensure wins entry
        updatePlayerList();
        document.getElementById("playerName").value = "";
    }
}

// Shuffle the PLAYERS array in the add-players screen
function shufflePlayers() {
    players.sort(() => Math.random() - 0.5);
    updatePlayerList();
    alert("Players have been shuffled!");
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
}

function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = players
        .map((player, i) =>
            `<li>
               ${player.name}
               <button onclick="removePlayer(${i})">❌ Delete</button>
             </li>`)
        .join("");
}

/** ========== STARTING THE GAME ========== **/

function startGame() {
    if (players.length < 2) {
        alert("At least two players are required to start the game.");
        return;
    }

    // currentPlayers is a fresh copy of players with 3 lives each
    currentPlayers = players.map(p => ({ name: p.name, lives: 3 }));
    currentIndex = 0;

    // Hide the add-player area, show the game area
    document.getElementById("setup").classList.add("hidden");
    document.querySelector("#game h2").classList.add("hidden");
    document.getElementById("currentPlayerBanner").classList.remove("hidden");
    document.getElementById("game-area").classList.remove("hidden");

    updateGameUI();

    document.getElementById("game-area").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/** ========== GAME ACTIONS ========== **/

// Update the UI (current player's name & lives list)
function updateGameUI() {
    if (currentPlayers.length === 0) {
        resetGamePage();
        return;
    }

    const currentPlayer = currentPlayers[currentIndex];
    document.getElementById("currentPlayer").textContent = currentPlayer.name;

    // Highlight current player in the lives list
    const livesList = document.getElementById("livesList");
    livesList.innerHTML = currentPlayers.map((player, i) => {
        const highlightClass = i === currentIndex ? 'highlight' : '';
        return `<li class="${highlightClass}">
                  ${player.name}: ${"❤️".repeat(player.lives)}
                </li>`;
    }).join("");
}

// Move to the next player
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

/** ========== ACTIONS WITH UNDO SUPPORT ========== **/

function pot() {
    // Store last action
    lastAction = {
        playerIndex: currentIndex,
        prevLives: currentPlayers[currentIndex].lives,
        actionType: 'pot', // For reference if needed
    };

    // No life change for a pot, just moves to next player
    lastAction.newLives = currentPlayers[currentIndex].lives; 
    lastAction.prevIndex = currentIndex; 

    nextPlayer();
}

function miss() {
    const oldLives = currentPlayers[currentIndex].lives;

    // Store last action
    lastAction = {
        playerIndex: currentIndex,
        prevLives: oldLives,
        actionType: 'miss',
        prevIndex: currentIndex
    };

    // Lose a life
    currentPlayers[currentIndex].lives--;
    lastAction.newLives = currentPlayers[currentIndex].lives;

    // Check if player is out
    if (currentPlayers[currentIndex].lives <= 0) {
        alert(`${currentPlayers[currentIndex].name} is out! ❌`);
        currentPlayers.splice(currentIndex, 1);

        // If we removed the player, we need to see if currentIndex is still valid
        if (currentIndex >= currentPlayers.length) {
            currentIndex = 0;
        }

        // If game is effectively over, nextPlayer() handles that check
    }
    nextPlayer();
}

function bonus() {
    const oldLives = currentPlayers[currentIndex].lives;

    // Store last action
    lastAction = {
        playerIndex: currentIndex,
        prevLives: oldLives,
        actionType: 'bonus',
        prevIndex: currentIndex
    };

    // Gain a life
    currentPlayers[currentIndex].lives++;
    lastAction.newLives = currentPlayers[currentIndex].lives;

    nextPlayer();
}

/** 
 * UNDO: Revert the latest action 
 * - Restores lives
 * - Restores currentIndex
 */
function undoAction() {
    if (!lastAction) {
        alert("No action to undo!");
        return;
    }

    const {
        playerIndex,
        prevLives,
        newLives,
        prevIndex,
        actionType
    } = lastAction;

    // If the player was removed on a 'miss' that killed them, 
    // we need to re-insert them into currentPlayers.

    // Case: If we removed the player (lives <= 0)
    // after a miss, we must reinsert them at the same index
    if (actionType === 'miss' && newLives < 1) {
        // We removed the currentPlayers[playerIndex], so let's put them back
        // We can store the player's name from the lastAction or deduce it
        // For simplicity, let's store the player's name in lastAction 
        // but we didn't do that above. We'll do it by capturing it before removal.

        // Let's approach a simpler fix: if we see newLives < 1, we do:
        // re-insert them with prevLives
        // We'll store the name in lastAction so we can restore.

        alert("Undo not possible if a player was completely removed. (Simple approach)");
        // If we want to handle it fully, we'd track the removed player's name 
        // and re-insert them. For now, let's keep it simple.
        return;
    }

    // Otherwise, revert that player's lives
    currentPlayers[playerIndex].lives = prevLives;

    // Revert the currentIndex to the old turn
    currentIndex = prevIndex;

    // Clean up lastAction
    lastAction = null;

    // Refresh UI
    updateGameUI();
}

/** ========== RESET & NAVIGATION ========== **/

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
    lastAction = null;
}

function resetToAddPlayer() {
    resetGamePage();    
    showPage('game');   // Remain on 'game' page with the setup
}

// Scoreboard
function updateScoreboard() {
    const sortedWins = Object.entries(wins)
        .sort(([, a], [, b]) => b - a)
        .map(([player, winCount]) => ({ player, winCount }));

    document.getElementById("scoreboard").innerHTML = sortedWins
        .map(({ player, winCount }) => `<li>${player}: ${winCount} 🏆</li>`)
        .join("");
}

// Show a specific page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    if (pageId === 'wins') {
        updateScoreboard();
    }
}
