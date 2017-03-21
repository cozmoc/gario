var socket;

var blob;
var blobs = [];
var eaten = [];
var zoom = 1;
var rands=["Pizza","Pasta","Olive","Falafel","BBQ","Cupcake","Donut","Sushi","Jelly","Noodles","Toast","Waffles","Yogurt"]
var colors = ['rgb(66, 134, 244)','rgb(65, 244, 68)','rgb(239, 187, 31)','rgb(198, 119, 255)','rgb(255, 119, 221)']
// var colors = ['rgb(100%,0%,10%)','rgb(10%,10%,10%)','rgb(50%,10%,40%)','rgb(0%,20%,70%)','rgb(0%,80%,10%)','rgb(70%,60%,10%)','rgb(12%,4%,80%)','rgb(50%,50%,30%)','rgb(90%,40%,20%)']
function setup() {
  var canvas = createCanvas(1000, 1000);
  canvas.position(300, 50);

  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://gario.herokuapp.com/');


  blob = new Blob(random(width), random(height), 8,rands[Math.floor(Math.random()*rands.length)],colors[Math.floor(Math.random()*colors.length)],[],false);
  // Make a little object with  and y
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
    n: blob.n,
    c: blob.c,
    e: blob.e,
    dead: blob.dead
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
      if (!eaten.includes(blobs[i].id)){
        fill(blobs[i].c);
        ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);
        //text 
        fill(0);
        textAlign(CENTER);
        textSize(blobs[i].r/3);
        text(blobs[i].n, blobs[i].x, blobs[i].y + (blobs[i].r/10));
      }
      if (!blob.e.includes(blobs[i].id) && blob.eats(blobs[i])) {
          blob.r += blobs[i].r/5;
          blob.e.push(blobs[i].id);
          blob.update();
      }
      
    }  
    // blobs[i].show();
    // if (blob.eats(blobs[i])) {
    //   blobs.splice(i, 1);
    // }
    // if (blob.e.includes("small")){
    //   blob.e.splice(blob.e.indexOf("small"),1);
    // }
    if(blobs[i].e[0]!==undefined ){
      for (var j = 0; j < blobs[i].e.length; j++) {
        if(!eaten.includes(blobs[i].e[j])){
          eaten.push(blobs[i].e[j]);
        }
      }
    }
    if (eaten.includes(socket.id)){
      blob.dead=true;
    }

    if (blob.dead){
      window.location.reload();
    }
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
    c: blob.c,
    e: blob.e,
    dead: blob.dead
    };
  socket.emit('update', data);


}