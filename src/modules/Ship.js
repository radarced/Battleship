// basic size : 100x50 - > 150x50 - > 200x50 - > 250x50
function Ship(level) {
  this.width = 50 + level * 50; // level starts from 1-5;
  this.height = 50; // constant .
  this.rotation = 0; // value can be either 0 or 90
  this.img = new Image(this.width, this.height);
  this.img.src = `./assets/ship${level}.png`;
}

export default Ship;
