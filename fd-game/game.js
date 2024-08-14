function startGame() {
    mainMenu.classList.remove('visible');
    gameOverScreen.classList.remove('visible'); // Hide the game over screen when restarting
    countdown = 5;
    gameOver = false;
    gameStarted = false;
    paused = false;
    player = { x: canvas.width / 2 - PLAYER_SIZE / 2, y: PLAYER_START_Y, size: PLAYER_SIZE, speed: PLAYER_SPEED };
    score = 0;
    spawnEnemies();

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
