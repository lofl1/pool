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

// CHANGED: Detect if running in standalone mode (installed as a home screen app)
if (window.navigator.standalone === true) {
    document.body.classList.add('standalone');
}

// Global Variables
let players = [];            
let currentPlayers = [];     
let currentIndex = 0;        
let wins = {};            
let lastAction = null;    

/** ========== ADDING PLAYERS & SHUFFLING ========== **/

function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName && !players.some(player => player.name === playerName)) {
        players.push({ name: playerName });
        wins[playerName] = wins[playerName] || 0;
        updatePlayerList();
        document.getElementById("playerName").value = "";
    }
}

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

    currentPlayers = players.map(p => ({ name: p.name, lives: 3 }));
    currentIndex = 0;

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

function updateGameUI() {
    if (currentPlayers.length === 0) {
        resetGamePage();
        return;
    }

    const currentPlayer = currentPlayers[currentIndex];
    document.getElementById("currentPlayer").textContent = currentPlayer.name;

    const livesList = document.getElementById("livesList");
    livesList.innerHTML = currentPlayers.map((player, i) => {
        const highlightClass = i === currentIndex ? 'highlight' : '';
        return `<li class="${highlightClass}">
            ${player.name}: ${"❤️".repeat(player.lives)}
            </li>`;
    }).join("");
}

function nextPlayer() {
    currentIndex = (currentIndex + 1) % currentPlayers.length;

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

function pot() {
    lastAction = {
        playerIndex: currentIndex,
        prevLives: currentPlayers[currentIndex].lives,
        actionType: 'pot',
        newLives: currentPlayers[currentIndex].lives,
		prevCurrentPlayers: [...currentPlayers],
        prevIndex: currentIndex
    };
    nextPlayer();
}

function miss() {
    const oldLives = currentPlayers[currentIndex].lives;
    lastAction = {
        playerIndex: currentIndex,
        prevLives: oldLives,
        actionType: 'miss',
		prevCurrentPlayers: [...currentPlayers],
        prevIndex: currentIndex
    };

    currentPlayers[currentIndex].lives--;
    lastAction.newLives = currentPlayers[currentIndex].lives;

    if (currentPlayers[currentIndex].lives <= 0) {
        alert(`${currentPlayers[currentIndex].name} is out! ❌`);
        currentPlayers.splice(currentIndex, 1);
        if (currentIndex >= currentPlayers.length) {
            currentIndex = 0;
        }
    }
    nextPlayer();
}

function bonus() {
    const oldLives = currentPlayers[currentIndex].lives;
    lastAction = {
        playerIndex: currentIndex,
        prevLives: oldLives,
        actionType: 'bonus',
		prevCurrentPlayers: [...currentPlayers],
        prevIndex: currentIndex
    };

    currentPlayers[currentIndex].lives++;
    lastAction.newLives = currentPlayers[currentIndex].lives;

    nextPlayer();
}

function kill() {
    const oldLives = currentPlayers[currentIndex].lives;
	lastAction = {
        playerIndex: currentIndex,
        prevLives: oldLives,
        actionType: 'kill',
		prevCurrentPlayers: [...currentPlayers],
        prevIndex: currentIndex,
		newLives: 0,
    };

    currentPlayers[currentIndex].lives = 0;
	
    if (currentPlayers[currentIndex].lives <= 0) {
        alert(`${currentPlayers[currentIndex].name} is out! 💀`);
        currentPlayers.splice(currentIndex, 1);
        if (currentIndex >= currentPlayers.length) {
            currentIndex = 0;
        }
    }
    nextPlayer();
}

/** 
 * UNDO: Revert the latest action
 */
function undoAction() {
    if (!lastAction) {
        alert("No action to undo!");
        return;
    }

    const { playerIndex, prevLives, newLives, prevIndex, actionType, prevCurrentPlayers } = lastAction;

	currentPlayers = [...prevCurrentPlayers];
    currentIndex = prevIndex;
	
	if(actionType === 'kill') {
        // If the action was a kill, we don't modify lives, just reinstate
		// the old array and index
		
    } else {
		currentPlayers[playerIndex].lives = prevLives;
	}

    lastAction = null;

    updateGameUI();
}

/** ========== RESET & NAVIGATION ========== **/

function resetGamePage() {
    document.querySelector("#game h2").classList.remove("hidden");
    document.getElementById("setup").classList.remove("hidden");
    document.getElementById("currentPlayerBanner").classList.add("hidden");
    document.getElementById("game-area").classList.add("hidden");
    document.getElementById("livesList").innerHTML = "";
    currentIndex = 0;
    currentPlayers = [];
    lastAction = null;
}

function resetToAddPlayer() {
    if (!confirm("Are you sure you want to RESET the game?")) {
        return;
    }
    resetGamePage();
    showPage('game');
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

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    if (pageId === 'wins') {
        updateScoreboard();
    }
}
