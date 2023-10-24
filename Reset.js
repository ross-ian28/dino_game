export default class Reset {
	constructor(ctx, width, height, scaleRatio) { 
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.scaleRatio = scaleRatio;
	}

	draw() {
		this.resetImage = new Image();
    this.resetImage.src = "images/reset.png";
    this.image = this.resetImage;

		this.x = 350 * this.scaleRatio;
		this.y = 100 * this.scaleRatio;

		this.ctx.drawImage(this.image, this.x, this.y, 80 * this.scaleRatio, 80 * this.scaleRatio);
	}
}