const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0
};

const bullets = [];
const asteroids = [];
const asteroidSpeed = 1;  // Slowed down the falling blocks
let gameOver = false;
let score = 0;
let shiftKeyPressed = false;

function drawPlayer() {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function shootBullet() {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
}

function drawBullets() {
    ctx.fillStyle = '#ffffff';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateBullets() {
    bullets.forEach(bullet => {
        bullet.y -= 5;

        if (bullet.y < 0) {
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });
}

function createAsteroid() {
    const x = Math.random() * (canvas.width - 30);
    asteroids.push({ x: x, y: 0, width: 30, height: 30 });
}

function drawAsteroids() {
    ctx.fillStyle = '#ff0000';
    asteroids.forEach(asteroid => {
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    });
}

function updateAsteroids() {
    asteroids.forEach(asteroid => {
        asteroid.y += asteroidSpeed;

        if (asteroid.y > canvas.height) {
            asteroids.splice(asteroids.indexOf(asteroid), 1);
        }

        if (
            player.x < asteroid.x + asteroid.width &&
            player.x + player.width > asteroid.x &&
            player.y < asteroid.y + asteroid.height &&
            player.y + player.height > asteroid.y
        ) {
            gameOver = true;
        }
    });
}

function checkCollisions() {
    bullets.forEach(bullet => {
        asteroids.forEach(asteroid => {
            if (
                bullet.x < asteroid.x + asteroid.width &&
                bullet.x + bullet.width > asteroid.x &&
                bullet.y < asteroid.y + asteroid.height &&
                bullet.y + bullet.height > asteroid.y
            ) {
                bullets.splice(bullets.indexOf(bullet), 1);
                asteroids.splice(asteroids.indexOf(asteroid), 1);
                score++;
            }
        });
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    if (!gameOver) {
        clear();
        drawPlayer();
        drawBullets();
        drawAsteroids();
        updatePlayer();
        updateBullets();
        updateAsteroids();
        checkCollisions();

        requestAnimationFrame(update);
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 35, canvas.height / 2 + 30);
        showRestartButton();
    }
}

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        shootBullet();
    } else if (e.key === 'Shift') {
        shiftKeyPressed = true;
    } else if (shiftKeyPressed && e.key.toLowerCase() === 'z') {
        window.location.href = 'https://theschoolweb.000webhostapp.com';
    }
}

function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        player.dx = 0;
    } else if (e.key === 'Shift') {
        shiftKeyPressed = false;
    }
}

function startGame() {
    document.getElementById('buttonContainer').style.display = 'none';
    gameOver = false;
    score = 0;
    bullets.length = 0;
    asteroids.length = 0;
    update();
    setInterval(createAsteroid, 1000);
}

function showRestartButton() {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = '<button class="button" id="restartButton">Restart Game</button>';
    buttonContainer.style.display = 'flex';
    document.getElementById('restartButton').addEventListener('click', startGame);
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

document.getElementById('startButton').addEventListener('click', startGame);
