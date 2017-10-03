var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.get('/', function(req, res) {
   res.sendfile('index.html', { root:__dirname });
});

var noofplayers = 2;
var users = [[]];
var roomno = 1;
io.on('connection', function(socket) {
   console.log('New user connected');

   if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > noofplayers-1) roomno++;
   socket.join("room-"+roomno);

   socket.on('setUsername', function(data) {
      console.log(data);
      
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push([]);
         (users[roomno-1]).push(data);
         socket.emit('userSet', {username: data});
      }
   });
    
   socket.on('msg', function(data) {
      io.sockets.in("room-"+roomno).emit('newmsg', data);
   });

   socket.on('oldmsg', function(){
      for (var i = 0; i < users[roomno-1].length - 1; i++) {
      socket.emit('oldmsg1', users[roomno-1][i]);
      }
   });
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
