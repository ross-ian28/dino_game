import Bird from "./Bird.js";

export default class BirdController {
  BIRD_INTERVAL_MIN = 500;
  BIRD_INTERVAL_MAX = 2000;

  nextBirdInterval = null;
  bird = [];

  constructor(ctx, birdImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.birdImages = birdImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextBirdTime();
  }

  setNextBirdTime() {
    const num = this.getRandomNumber(
      this.BIRD_INTERVAL_MIN,
      this.BIRD_INTERVAL_MAX
    );

    this.nextBirdInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createBird() {
    const index = this.getRandomNumber(0, this.birdImages.length - 1);
    const birdImage = this.birdImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - birdImage.height - 100 * this.scaleRatio;
    const newBird = new Bird(
      this.ctx, 
      x, 
      y, 
      birdImage.width, 
      birdImage.height, 
      birdImage.image
    );

    this.bird.push(newBird);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextBirdInterval <= 0) {
      this.createBird();
      this.setNextBirdTime();
    }
    this.nextBirdInterval -= frameTimeDelta;

    this.bird.forEach((birds) => {
      birds.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.bird = this.bird.filter(birds=>birds.x > -birds.width);
  }

  draw() {
    this.bird.forEach(birds => birds.draw());
  }

  collideWith(sprite) {
    return this.bird.some((birds) => birds.collideWith(sprite));
  }

  reset() {
    this.bird = [];
  }
}