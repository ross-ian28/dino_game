import Player from "./Player.js"
import Ground from "./Ground.js"
import CactiController from "./CactiController.js";
import BirdController from "./BirdController.js";
import Score from "./Score.js";
import Reset from "./Reset.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 0.75 // 1.0
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5; // 58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.5;

const CACTI_CONFIG = [
  {width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png'}, 
  {width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png'}, 
  {width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png'} 
];

const BIRD_CONFIG = [
  {width: 48 / 1.5, height: 100 / 1.5, image: 'images/bird_fly1.png'}
];

//Game Objects
let player = null;
let ground = null;
let cactiController = null;
let birdController = null;
let score = null;
let resetImage = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenerForRestart = false;
let waitingToStart = true;

function createSprites() {
  // Adjust objects to window size
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;
  player = new Player(
    ctx, 
    playerWidthInGame, 
    playerHeightInGame,
    minJumpHeightInGame, 
    maxJumpHeightInGame, 
    scaleRatio
  );

  ground = new Ground(
    ctx, 
    groundWidthInGame, 
    groundHeightInGame, 
    GROUND_AND_CACTUS_SPEED, 
    scaleRatio
  );

  const cactiImages = CACTI_CONFIG.map(cactus => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio, 
      height: cactus.height * scaleRatio 
    }
  });

  cactiController = new CactiController(
    ctx, 
    cactiImages, 
    scaleRatio, 
    GROUND_AND_CACTUS_SPEED
  );

  score = new Score(ctx, scaleRatio);

  resetImage = new Reset(
    ctx,
    canvas.width, 
    canvas.height,
    scaleRatio
  );

  const birdImages = BIRD_CONFIG.map(bird => {
    const image = new Image();
    image.src = bird.image;
    return {
      image: image,
      width: bird.width * scaleRatio, 
      height: bird.height * scaleRatio 
    }
  });

  birdController = new BirdController(
    ctx, 
    birdImages, 
    scaleRatio, 
    GROUND_AND_CACTUS_SPEED
  );
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();

window.addEventListener("resize", setScreen);

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight, 
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function showGameOver() {
  clearScreen();

  resetImage.draw();

  const TryAgainfontSize = 40 * scaleRatio;
  ctx.font = `${TryAgainfontSize}px Impact`;
  ctx.fillStyle = "grey";
  ctx.fillText("Press Space To Try Again", canvas.width / 4, canvas.height / 3);
}

function setGameReset() {
  if(!hasAddedEventListenerForRestart) {
    hasAddedEventListenerForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, {once: true});
      window.addEventListener("touchstart", reset, {once: true});
    }, 1000);
  }
}

function reset() {
  hasAddedEventListenerForRestart = false;
  gameOver = false; 
  waitingToStart = false;
  ground.reset();
  cactiController.reset();
  birdController.reset();
  score.reset();
  // resetImage.reset();
  gameSpeed = GAME_SPEED_START;
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  ctx.fillText("Press Space To Start", canvas.width / 4, canvas.height / 2);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime
  previousTime = currentTime;

  clearScreen();

  if (!gameOver && !waitingToStart) {
    // Update game objects
    ground.update(gameSpeed, frameTimeDelta);
    cactiController.update(gameSpeed, frameTimeDelta);
    birdController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && cactiController.collideWith(player)) {
    gameOver = true;
    setGameReset();
    score.setHighScore();
  }
  // Draw game objects
  ground.draw();
  cactiController.draw();
  birdController.draw();
  player.draw();
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, {once: true});
window.addEventListener("touchstart", reset, {once: true});