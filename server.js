// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var blobs = [];
var eaten = [];

function Blob(id, x, y, r, n, c, dead,ate) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.n = n;
  this.c = c;
  this.dead = dead;
  this.ate = ate;
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
        var blob = new Blob(socket.id, data.x, data.y, data.r, data.n, data.c);
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
          if (eaten.includes(blob.id)){
            blobs.splice(i, 1);
          }
          if (blob.ate.length > 0){
            for (var j = 0; j < blob.ate.length; j++) {
              if (!eaten.includes(blob.ate[j])){
                eaten.push(blob.ate[j])
              }
            }
          }
        }
        blob.x = data.x;
        blob.y = data.y;
        blob.r = data.r;
        blob.n = data.n;
        blob.c = data.c;
        blob.dead = data.dead;
        blob.ate = data.ate;
      }
    );



    socket.on('disconnect', function() {
      console.log("Client " + socket.id + " has disconnected, " + blobs[0].id);
        for (i = 0; i < blobs.length; i++) {
            if (blobs[i].id == socket.id) {
                blobs.splice(i, 1);
                console.log(blobs);
            }
        }
    });
  }
);