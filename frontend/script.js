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

// Navigation: Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));

    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.error(`Page with ID "${pageId}" not found.`);
    }

    // Close the burger menu
    closeMenu();
}

// Add players
function addPlayer() {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName) {
        const playerList = document.getElementById("playerList");
        const newPlayer = document.createElement("li");
        newPlayer.textContent = playerName;
        playerList.appendChild(newPlayer);

        document.getElementById("playerName").value = ""; // Clear input
    }
}

// Start the game
function startGame() {
    const playerList = document.getElementById("playerList").children;
    if (playerList.length < 2) {
        alert("At least two players are required to start the game.");
        return;
    }

    // Hide setup and show game area
    document.getElementById("setup").classList.add("hidden");
    const gameArea = document.getElementById("game-area");
    gameArea.classList.remove("hidden");

    // Scroll to the game area
    gameArea.scrollIntoView({ behavior: "smooth" });

    console.log("Game started!");
}

// Placeholder functions for gameplay actions
function pot() {
    alert("POT action triggered.");
}

function miss() {
    alert("MISS action triggered.");
}

function bonus() {
    alert("BONUS action triggered.");
}

function shuffleOrder() {
    alert("SHUFFLE ORDER action triggered.");
}
