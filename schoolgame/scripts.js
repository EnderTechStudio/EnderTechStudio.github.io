// Game Variables
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 30,
    width: 50,
    height: 10,
    speed: 4,  // Slower player speed
    dx: 0
};

let fallingObject = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    width: 20,
    height: 20,
    speed: 4
};

let score = 0;
let lives = 3;
let isGameOver = false;

// Event Listeners for Movement
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Player Control Functions
function keyDown(e) {
    if (e.key === "ArrowRight" || e.key === "Right") {
        player.dx = player.speed;
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
        player.dx = -player.speed;
    }
}

function keyUp(e) {
    if (e.key === "ArrowRight" || e.key === "Right" || e.key === "ArrowLeft" || e.key === "Left") {
        player.dx = 0;
    }
}

// Draw Player Paddle
function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw Falling Object
function drawFallingObject() {
    ctx.fillStyle = "red";
    ctx.fillRect(fallingObject.x, fallingObject.y, fallingObject.width, fallingObject.height);
}

// Move Player
function movePlayer() {
    player.x += player.dx;

    // Prevent player from going off the canvas
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Move Falling Object
function moveFallingObject() {
    fallingObject.y += fallingObject.speed;

    // If object reaches bottom and player misses it
    if (fallingObject.y + fallingObject.height > canvas.height) {
        lives--;
        if (lives === 0) {
            endGame();
        } else {
            resetFallingObject();
        }
    }
}

// Reset Falling Object Position
function resetFallingObject() {
    fallingObject.y = 0;
    fallingObject.x = Math.random() * (canvas.width - fallingObject.width);
}

// Check Collision
function checkCollision() {
    if (
        fallingObject.y + fallingObject.height > player.y &&
        fallingObject.x < player.x + player.width &&
        fallingObject.x + fallingObject.width > player.x
    ) {
        // Collision detected, reset falling object and increase score
        score++;
        resetFallingObject();
    }
}

// Draw Score and Lives (Hearts)
function drawScoreAndLives() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    ctx.fillStyle = "red";
    ctx.fillText("Lives: " + "❤".repeat(lives), canvas.width - 360, 20);
}

// End the game
function endGame() {
    isGameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
    
    setTimeout(restartGame, 5000);  // Wait 5 seconds before restarting
}

// Restart the game
function restartGame() {
    score = 0;
    lives = 3;
    fallingObject.speed = 2;
    isGameOver = false;
    update();  // Restart the game loop
}

// Display credits at the start
function showCredits() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Made by Nolan Hartigan. Phone do not work!", canvas.width / 2 - 150, canvas.height / 2);
    setTimeout(update, 3000);  // Wait 3 seconds, then start the game
}

// Update Game
function update() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawFallingObject();
        movePlayer();
        moveFallingObject();
        checkCollision();
        drawScoreAndLives();

        requestAnimationFrame(update);
    }
}

// Start the game with credits
showCredits();
