var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.get('/', function(req, res) {
   res.sendfile('index_new.html', { root:__dirname });
});

//var noofplayers = 2;
var list_of_games = [];
function game() {
    console.log("new game created");
   this.GameID = undefined;
   this.list_of_players_in_game = [];
   this.Total_Players = 0;
   this.Curr_no_Players = 0;
}


get_owner_by_gid = function(gid){
   var temp = list_of_games.length;
      for (var i = 0; i < temp; i++){
         if (list_of_games[i].GameId == gid){
            return list_of_games[i];
         }
      }
   }

var list_of_playerID = [];
var roomno = 0;
io.on('connection', function(socket) {
   console.log('New user connected');
   //if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > noofplayers-1) roomno++;
   
      socket.on('setGameID', function(data) {
      Game_ID = data.gameID;
      PlayerID = data.playerID;
      NoOfPlayers = data.noOfPlayers;
      var g1 = get_owner_by_gid(Game_ID);
      if(list_of_games.indexOf(g1) > -1){
         if(g1.Total_Players>=g1.Curr_no_Players){
            socket.emit('GameIDExists','The game with GameID '+ g1.GameID+ ' is full. Try after sometime!!');
         }
         else{
            g1.GameID=GameID;
            g1.list_of_players_in_game.push(PlayerID);
            g1.Curr_no_Players++;
            socket.join(g1.GameID);
            io.sockets.in(g1.GameID).emit('add_player', g1);
         }
      }
      else {
         var g = new game();
         console.log(g);
         g.GameID = Game_ID;
         g.list_of_players_in_game.push(PlayerID);
         g.Total_Players = NoOfPlayers;
         g.Curr_no_Players++;
         list_of_games.push(g);
         socket.join(g.GameID);
         socket.emit('create_new_game', g);
      }
   });
   

   socket.on('setPlayerID', function(data){
      if(list_of_playerID.indexOf(data) > -1) {
         socket.emit('PlayerIDExists', 'PlayerID ' + data + ' already exists! Try another PlayerID');
      } else {
         list_of_playerID.push(data);
         socket.emit('settingPlayerID', data);
      }
   });
   /*socket.on('msg', function(data) {
      io.sockets.in("room-"+roomno).emit('newmsg', data);
   });

   socket.on('oldmsg', function(){
      for (var i = 0; i < users[roomno-1].length - 1; i++) {
      socket.emit('oldmsg1', users[roomno-1][i]);
      }
   });

   socket.on('disconnect', function(){
      console.log(user + ' is disconnected');
      socket.leave("room-"+roomno);
   });*/
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});