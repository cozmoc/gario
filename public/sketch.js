var socket;

var blob;

var blobs = [];
var zoom = 1;
var rands=["Pizza","Pasta","Olive","Falafel","BBQ","Cupcake","Donut","Sushi","Jelly","Noodles","Toast","Waffles","Yogurt"]
var colors = ['rgb(66, 134, 244)','rgb(65, 244, 68)','rgb(65, 244, 235)','rgb(239, 187, 31)','rgb(198, 119, 255)','rgb(255, 119, 221)','rgb(96, 219, 198)']
// var colors = ['rgb(100%,0%,10%)','rgb(10%,10%,10%)','rgb(50%,10%,40%)','rgb(0%,20%,70%)','rgb(0%,80%,10%)','rgb(70%,60%,10%)','rgb(12%,4%,80%)','rgb(50%,50%,30%)','rgb(90%,40%,20%)']
function setup() {
  var canvas = createCanvas(1000, 1000);
  canvas.position(300, 50);

  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://gario.herokuapp.com');


  blob = new Blob(random(width), random(height), random(8, 24),rands[Math.floor(Math.random()*rands.length)],colors[Math.floor(Math.random()*colors.length)]);
  // Make a little object with  and y
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    n: blob.n,
    c: blob.c
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
      fill(blobs[i].c);
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
    n: blob.n,
    c: blob.c
  };
  socket.emit('update', data);


}