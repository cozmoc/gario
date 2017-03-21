function Blob(x, y, r, n, c, e, dead) {
  this.pos = createVector(x, y);
  this.r = r;
  this.n = n;
  this.c = c;
  this.vel = createVector(0, 0);
  this.e = e;
  this.dead = dead;

  this.update = function() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.div(50);
    //newvel.setMag(3);
    newvel.limit(3);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  }

  this.eats = function(other) {
    if ( (Math.abs(this.pos.x - other.x) <= this.r+other.r) && (Math.abs(this.pos.y - other.y) <= this.r+other.r)) {
      if (other.r < this.r) {
        //var sum = PI * this.r * this.r + PI * other.r * other.r;
        //this.r = sqrt(sum / PI);
        // this.r += other.r;
        return true;
      } else {
        return false;
      }
    }
  }

  this.constrain = function() {
    blob.pos.x = constrain(blob.pos.x, -width / 4, width / 4);
    blob.pos.y = constrain(blob.pos.y, -height / 4, height / 4);
  }

  this.show = function() {
    fill(this.c);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    fill(0);
    textAlign(CENTER);
    textSize(this.r/3);
    text(this.n, this.pos.x, this.pos.y + (this.r/10));

    fill(0);
    textAlign(CENTER);
    textSize(this.r/3);
    text("Score: " + this.e.length , this.pos.x, this.pos.y -(this.r*7));

  }  
}