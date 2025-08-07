const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Game constants
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

// Player paddle
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0
};

// Computer paddle
const com = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'WHITE',
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: 'WHITE'
};

// Draw rect function
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw circle function
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw text function
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = '75px fantasy';
    context.fillText(text, x, y);
}

// Render the game
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'BLACK');

    // Draw the net
    drawNet();

    // Draw the scores
    drawText(player.score, canvas.width / 4, canvas.height / 5, 'WHITE');
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, 'WHITE');

    // Draw the paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Control the player paddle
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
}

// Update function, called every frame
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Computer paddle AI
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;


    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let p = (ball.x < canvas.width / 2) ? player : com;

    if (collision(ball, p)) {
        // Find where the ball hit the paddle
        let collidePoint = (ball.y - (p.y + p.height / 2));
        // Normalize the value
        collidePoint = collidePoint / (p.height / 2);

        // Calculate angle in Radian
        let angleRad = (Math.PI / 4) * collidePoint;

        // Change the X and Y velocity direction
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Increase speed every time a paddle is hit
        ball.speed += 0.5;
    }

    // Update score
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }
}

// Draw net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 2, i, 4, 10, 'WHITE');
    }
}


// Game loop
function game() {
    update();
    render();
}

// Number of frames per second
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
