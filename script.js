/** CONSTANTS **/


let SNAKE_COLOUR = `rgb(${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)})`;
const backColour = `rgb(${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)})`;
// const SNAKE_COLOUR = `rgb(${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)})`;
const SNAKE_BORDER_COLOUR = 'darkgreen';

 let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
]

let score = 0;
let level = 1;
let speed = Math.max((100 - Math.floor(score/100)*5), 25);

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get the canvas element
var gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
var ctx = gameCanvas.getContext("2d");

function clearCanvas() {
    ctx.fillStyle = backColour;
    ctx.strokestyle = "black";
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
createFood();
main();
document.addEventListener("keydown", changeDirection);

function main(){
    if (didGameEnd()){
        document.getElementById('level').innerHTML = `Game over!`;
        return;
    }
    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, speed);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        if (score % 100 == 0){
            SNAKE_COLOUR = `rgb(${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)})`; 
            level++;
            document.getElementById('level').innerHTML = `Level ${level}`;
        }
        document.getElementById('score').innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
}           

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x &&
        snake[i].y === snake[0].y
        if (didCollide) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;
    return hitLeftWall || 
    hitRightWall || 
    hitToptWall ||
    hitBottomWall
}  
 /**
* Draws the snake on the canvas
*/
function drawSnake() {
// loop through the snake parts drawing each part on the canvas
    snake.forEach(drawSnakePart)
}
/**
* Draws a part of the snake on the canvas
* @param { object } snakePart - The coordinates where the part should be drawn
*/
function drawSnakePart(snakePart) {
    // Set the colour of the snake part
    ctx.fillStyle = SNAKE_COLOUR;
    // Set the border colour of the snake part
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}
function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY
        if (foodIsOnSnake)
        createFood();
    });
}

function drawFood() {
    let randColour = `rgb(${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)})`;
    ctx.fillStyle = randColour;
    ctx.strokestyle = `rgb(${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)}, ${Math.floor(Math.random()* 255)})`;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}
