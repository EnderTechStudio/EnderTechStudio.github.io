const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('mainMenu');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const PLAYER_SIZE = 50;
const ENEMY_SIZE = 50;
const ENEMY_SPEED = 3;
const PLAYER_SPEED = 10;
const PLAYER_START_Y = canvas.height - 150;

let player = { x: canvas.width / 2 - PLAYER_SIZE / 2, y: PLAYER_START_Y, size: PLAYER_SIZE, speed: PLAYER_SPEED };
let enemy = { x: 400, y: 0, size: ENEMY_SIZE, speed: ENEMY_SPEED };
let score = 0;
let highScore = 0;
let gameOver = false;
let gameStarted = false;
let countdown = 5;
let paused = false;
let gameLoopId = null;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
    if ((e.key === 'ArrowLeft' || e.key === 'a') && !paused) {
        player.x -= player.speed;
    } else if ((e.key === 'ArrowRight' || e.key === 'd') && !paused) {
        player.x += player.speed;
    } else if (e.key === 'p' || e.key === 'P') {
        togglePause();
    }
}

function togglePause() {
    paused = !paused;
    if (paused) {
        cancelAnimationFrame(gameLoopId);
    } else {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function movePlayer() {
    if (!gameOver && gameStarted && !paused) {
        if (player.x < 0) {
            player.x = 0;
        } else if (player.x + player.size > canvas.width) {
            player.x = canvas.width - player.size;
        }
    }
}

function detectCollision() {
    return (
        player.x < enemy.x + enemy.size &&
        player.x + player.size > enemy.x &&
        player.y < enemy.y + enemy.size &&
        player.y + player.size > enemy.y
    );
}

function startGame() {
    mainMenu.classList.remove('visible');
    gameOverScreen.classList.remove('visible');
    countdown = 5;
    gameOver = false;
    gameStarted = false;
    paused = false;
    player = { x: canvas.width / 2 - PLAYER_SIZE / 2, y: PLAYER_START_Y, size: PLAYER_SIZE, speed: PLAYER_SPEED };
    enemy = { x: 400, y: 0, size: ENEMY_SIZE, speed: ENEMY_SPEED };
    score = 0;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`Starting in ${countdown}`, canvas.width / 2 - 150, canvas.height / 2);
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            gameStarted = true;
            gameLoopId = requestAnimationFrame(gameLoop);
        }
    }, 1000);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver && !paused) {
        movePlayer();
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemy.y = 0;
            enemy.x = player.x + (Math.random() * ENEMY_SIZE - ENEMY_SIZE / 2);
            score++;
        }

        if (detectCollision()) {
            gameOver = true;
            gameOverScreen.classList.add('visible');
            document.getElementById('finalScore').textContent = score;
            if (score > highScore) {
                highScore = score;
                updateHighScore();
                saveHighScore();
            }
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(player.x, player.y, player.size, player.size);
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }

    if (gameStarted && !paused) {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function updateHighScore() {
    document.getElementById('highScore').textContent = highScore;
}

function saveHighScore() {
    document.cookie = `highScore=${highScore}; expires=${getCookieExpirationDate()}; path=/`;
}

function getCookieExpirationDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toUTCString();
}

function getHighScoreFromCookie() {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'highScore') {
            return parseInt(value) || 0;
        }
    }
    return 0;
}

highScore = getHighScoreFromCookie();
updateHighScore();

requestAnimationFrame(gameLoop);
