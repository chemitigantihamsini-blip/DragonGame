const container = document.getElementById('game-container');
const dragon = document.getElementById('dragon');
const scoreDisplay = document.getElementById('score-display');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');

let isJumping = false;
let isGameOver = true;
let score = 0;
let obstacleSpeed = 6;
let obstacleSpawnTimer = 0;
let obstacles = [];
let animationFrameId;

let dragonY = 20; 
let velocityY = 0;
const gravity = 0.6;
const jumpForce = 12;
const groundY = 20;

const obstacleTypes = ['🔥', '🪨', '🌵'];

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        handleJump();
    }
});

container.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    handleJump();
});

startBtn.addEventListener('click', resetGame);

function handleJump() {
    if (isGameOver) return;
    if (!isJumping) {
        velocityY = jumpForce;
        isJumping = true;
    }
}

function resetGame() {
    obstacles.forEach(obs => obs.element.remove());
    obstacles = [];
    score = 0;
    obstacleSpeed = 6;
    dragonY = groundY;
    velocityY = 0;
    isJumping = false;
    isGameOver = false;
    obstacleSpawnTimer = 0;

    scoreDisplay.innerText = `Score: ${score}`;
    gameOverScreen.classList.add('hidden');

    gameLoop();
}

function spawnObstacle() {
    const element = document.createElement('div');
    element.classList.add('obstacle');
    
    const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    element.innerText = randomType;
    
    container.appendChild(element);

    obstacles.push({
        element: element,
        x: 800,
        width: 40,
        height: 50
    });
}

function gameLoop() {
    if (isGameOver) return;

    if (isJumping) {
        velocityY -= gravity;
        dragonY += velocityY;

        if (dragonY <= groundY) {
            dragonY = groundY;
            velocityY = 0;
            isJumping = false;
        }
        dragon.style.bottom = `${dragonY}px`;
    }

    obstacleSpawnTimer++;
    const spawnInterval = Math.max(60, 120 - Math.floor(score / 5)); 
    if (obstacleSpawnTimer >= spawnInterval) {
        spawnObstacle();
        obstacleSpawnTimer = 0;
    }

    obstacleSpeed = 6 + Math.floor(score / 10);

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= obstacleSpeed;
        obs.element.style.left = `${obs.x}px`;

        if (obs.x + obs.width < 0) {
            obs.element.remove();
            obstacles.splice(i, 1);
            score++;
            scoreDisplay.innerText = `Score: ${score}`;
            continue;
        }

        const dragonRect = {
            left: 50,
            right: 110, 
            bottom: dragonY,
            top: dragonY + 60
        };

        const obsRect = {
            left: obs.x,
            right: obs.x + obs.width,
            bottom: 20,
            top: 20 + obs.height
        };

        if (
            dragonRect.right > obsRect.left &&
            dragonRect.left < obsRect.right &&
            dragonRect.top > obsRect.bottom &&
            dragonRect.bottom < obsRect.top
        ) {
            endGame();
            return;
        }
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function endGame() {
    isGameOver = true;
    cancelAnimationFrame(animationFrameId);
    finalScore.innerText = `Your Score: ${score}`;
    gameOverScreen.classList.remove('hidden');
}

endGame();
document.querySelector('#game-over-screen h1').innerText = "DRAGON ADVENTURE";
startBtn.innerText = "Start Game";
