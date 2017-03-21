var blobs = [];
function Blob(id, x, y, r, n, c, e, dead) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.n = n;
  this.c = c;
  this.e = e;
  this.dead = dead;
}

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat() {
  io.sockets.emit('heartbeat', blobs);
}



// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {

    console.log("We have a new client: " + socket.id);


    socket.on('start',
      function(data) {
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var blob = new Blob(socket.id, data.x, data.y, data.r, data.n, data.c , data.e, data.dead);
        blobs.push(blob);
      }
    );

    socket.on('update',
      function(data) {
        //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var blob;
        for (var i = 0; i < blobs.length; i++) {
          if (socket.id == blobs[i].id) {
            blob = blobs[i];
          }
        }
        blob.x = data.x;
        blob.y = data.y;
        blob.r = data.r;
        blob.n = data.n;
        blob.c = data.c;
        blob.e = data.e;
        blob.dead = data.dead;
      }
    );

    var rands=["Pizza","Pasta","Olive","Falafel","BBQ","Cupcake","Donut","Sushi","Jelly","Noodles","Toast","Waffles","Yogurt"]
    var colors = ['rgb(66, 134, 244)','rgb(65, 244, 68)','rgb(239, 187, 31)','rgb(198, 119, 255)','rgb(255, 119, 221)']
    var num=0;
    setInterval(function(){
      if(blobs.length<700){
        num++;
        blobs.push(new Blob("small"+num, Math.floor(Math.random()*700), Math.floor(Math.random()*700), 2,"",colors[Math.floor(Math.random()*colors.length)],[],false));
      }
    },500)

    socket.on('disconnect', function() {
      console.log("Client " + socket.id + " has disconnected, with ID " + blobs[0].id);
        for (i = 0; i < blobs.length; i++) {
            if (blobs[i].id == socket.id) {
                blobs.splice(i, 1);
                console.log(blobs);
            }
        }
    });
  }
);