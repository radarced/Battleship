// basic size : 100x50 - > 150x50 - > 200x50 - > 250x50
function Ship(level) {
  this.width = 50 + level * 50; // level starts from 1-5;
  this.height = 50; // constant .
  this.rotation = 0; // value can be either 0 or 90
  this.player = this.player;
  this.level = level;
  this.img = new Image(this.width, this.height);
  this.img.src = `./assets/ship${level}.png`;
  // this will be used later in event handling
  this.img.dataset.level = this.level;
}

export default Ship;
