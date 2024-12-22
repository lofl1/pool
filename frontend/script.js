const backendURL = 'https://pool-69rx.onrender.com'; // Replace with your backend URL

let wins = {};
let currentPlayers = [];
let currentIndex = 0;

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
}

function closeMenu() {
    const menu = document.getElementById("menu");
    menu.classList.add("hidden");
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName && !wins[playerName]) {
        wins[playerName] = 0;
        updatePlayerList();
        document.getElementById("playerName").value = "";
    }
}

function updatePlayerList() {
    const playerList = document.getElementById("playerList");
    playerList.innerHTML = Object.keys(wins)
        .map(player => `<li>${player}</li>`)
        .join("");
}

function startGame() {
    if (Object.keys(wins).length < 2) {
        alert("At least two players are required to start the game.");
        return;
    }
    currentPlayers = Object.keys(wins).map(name => ({ name, lives: 3 }));
    currentIndex = 0;

    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game-area").classList.remove("hidden");

    updateGameUI();
}

function updateGameUI() {
    if (currentPlayers.length === 0) {
        alert("Game Over!");
        resetGame();
        return;
    }

    const currentPlayer = currentPlayers[currentIndex];
    document.getElementById("currentPlayer").textContent = currentPlayer.name;

    const livesList = document.getElementById("livesList");
    livesList.innerHTML = currentPlayers
        .map(player => `<li>${player.name}: ${"❤️".repeat(player.lives)}</li>`)
        .join("");
}

function pot() {
    currentIndex = (currentIndex + 1) % currentPlayers.length;
    updateGameUI();
}

function miss() {
    currentPlayers[currentIndex].lives--;
    if (currentPlayers[currentIndex].lives <= 0) {
        alert(`${currentPlayers[currentIndex].name} is out!`);
        currentPlayers.splice(currentIndex, 1);
        if (currentIndex >= currentPlayers.length) {
            currentIndex = 0;
        }
    }
    updateGameUI();
}

function bonus() {
    currentPlayers[currentIndex].lives++;
    updateGameUI();
}

function shuffleOrder() {
    currentPlayers.sort(() => Math.random() - 0.5);
    updateGameUI();
    alert("Player order shuffled!");
}

function resetGame() {
    document.getElementById("setup").classList.remove("hidden");
    document.getElementById("game-area").classList.add("hidden");
    currentPlayers = [];
    currentIndex = 0;
}
