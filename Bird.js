export default class Bird {
  FLY_ANIMATION_TIMER = 200;
  flyAnimationTimer = this.FLY_ANIMATION_TIMER;
  birdFlyImages = [];

  constructor(ctx, x, y, width, height, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;

    const birdFlyImage1 = new Image();
    birdFlyImage1.src = 'images/bird_fly1.png';

    const birdFlyImage2 = new Image();
    birdFlyImage2.src = 'images/bird_fly2.png';

    this.birdFlyImages.push(birdFlyImage1);
    this.birdFlyImages.push(birdFlyImage2);
  }
  
  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
  }
  
  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height )
  }

  collideWith(sprite) {
    const adjustBy = 1.4;

    if (
      sprite.x < this.x + this.width / adjustBy && 
      sprite.x + sprite.width / adjustBy > this.x &&
      sprite.y < this.y + this.height / adjustBy &&
      sprite.height + sprite.y / adjustBy > this.y
    ) {
      return true; 
    } else {
      return false;
    }
  }
    
  fly(gameSpeed, frameTimeDelta) {
    if(this.walkAnimationTimer <= 0) {
      if(this.image === this.birdFlyImages[0]) {
        this.image = this.birdFlyImages[1];
      }
      else {
        this.image = this.birdFlyImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }
}