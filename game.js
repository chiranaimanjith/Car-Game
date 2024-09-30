const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score-value');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreElement = document.getElementById('final-score');

const GAME_WIDTH = gameArea.offsetWidth;
const GAME_HEIGHT = gameArea.offsetHeight;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 100;
const LANE_COUNT = 3;
const LANE_WIDTH = GAME_WIDTH / LANE_COUNT;

let playerLane = 1;
let score = 0;
let obstacles = [];
let gameLoop;
let obstacleInterval;
let isGameOver = false;

function movePlayer(direction) {
    if (direction === 'left' && playerLane > 0) {
        playerLane--;
    } else if (direction === 'right' && playerLane < LANE_COUNT - 1) {
        playerLane++;
    }
    player.style.left = `${playerLane * LANE_WIDTH + (LANE_WIDTH - PLAYER_WIDTH) / 2}px`;
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const lane = Math.floor(Math.random() * LANE_COUNT);
    obstacle.style.left = `${lane * LANE_WIDTH + (LANE_WIDTH - PLAYER_WIDTH) / 2}px`;
    gameArea.appendChild(obstacle);
    obstacles.push({ element: obstacle, lane: lane });

    obstacle.addEventListener('animationend', () => {
        if (gameArea.contains(obstacle)) {
            gameArea.removeChild(obstacle);
            obstacles = obstacles.filter(obs => obs.element !== obstacle);
            score++;
            scoreElement.textContent = score;
        }
    });
}

function updateGame() {
    obstacles.forEach((obstacle) => {
        const obstacleRect = obstacle.element.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (isCollision(playerRect, obstacleRect)) {
            endGame();
        }
    });
}

function isCollision(rect1, rect2) {
    return !(rect1.top > rect2.bottom || 
             rect1.bottom < rect2.top || 
             rect1.right < rect2.left || 
             rect1.left > rect2.right);
}

function endGame() {
    isGameOver = true;
    clearInterval(gameLoop);
    clearInterval(obstacleInterval);
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function startGame() {
    isGameOver = false;
    score = 0;
    scoreElement.textContent = score;
    obstacles.forEach(obstacle => gameArea.removeChild(obstacle.element));
    obstacles = [];
    playerLane = 1;
    player.style.left = `${playerLane * LANE_WIDTH + (LANE_WIDTH - PLAYER_WIDTH) / 2}px`;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameLoop = setInterval(updateGame, 50);
    obstacleInterval = setInterval(createObstacle, 2000);
}

document.addEventListener('keydown', (e) => {
    if (!isGameOver) {
        if (e.key === 'ArrowLeft') {
            movePlayer('left');
        } else if (e.key === 'ArrowRight') {
            movePlayer('right');
        }
    }
});

leftBtn.addEventListener('click', () => !isGameOver && movePlayer('left'));
rightBtn.addEventListener('click', () => !isGameOver && movePlayer('right'));
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);