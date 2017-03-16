var socket;

var blob;

var blobs = [];
var zoom = 1;
var rands=["Sameer","Sob7i","Amer","Stupid","Ahmad","Yousef","Lindsey"]

function setup() {
  var canvas = createCanvas(1000, 1000);
  canvas.position(300, 50);

  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://gario.herokuapp.com');


  blob = new Blob(random(width), random(height), random(8, 24),rands[Math.floor(Math.random()*rands.length)]);
  // Make a little object with  and y
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    n: blob.n
  };
  socket.emit('start', data);

  socket.on('heartbeat',
    function(data) {
      //console.log(data);
      blobs = data;
    }
  );
}

function draw() {
  background(255,255,255);
  //console.log(blob.pos.x, blob.pos.y);

  translate(width / 2, height / 2);
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  for (var i = blobs.length - 1; i >= 0; i--) {
    var id = blobs[i].id;
    if (id !== socket.id) {
      fill(255, 0, 0);
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);
      //text 
      fill(0);
      textAlign(CENTER);
      textSize(blobs[i].r/3);
      text(blobs[i].n, blobs[i].x, blobs[i].y + (blobs[i].r/10)); 
    }  
    // blobs[i].show();
    // if (blob.eats(blobs[i])) {
    //   blobs.splice(i, 1);
    // }
  }



  blob.show();
  if (mouseIsPressed) {
    blob.update();
  }
  blob.constrain();

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    n: blob.n
  };
  socket.emit('update', data);


}