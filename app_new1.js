var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.get('/', function(req, res) {
	res.sendfile('index_new.html', { root:__dirname });
});


app.get( '/*' , function( req, res, next ) {

		//This is the current file they have requested
	var file = req.params[0];

		//For debugging, we can track what files are requested.
	if(true) {
		console.log('\t :: Express :: file requested : ' + file);
		//console.log('\t__dirname = ' + __dirname + ';;full path given = ' + __dirname + '/' + file);
	}

		//Send the requesting client the file.
	res.sendfile( __dirname + '/' + file );

});

io.configure(function (){

	io.set('log level', 0);

	io.set('authorization', function (handshakeData, callback) {
	  callback(null, true); // error first callback style
	});

});


var list_of_games=[];
var game = require('./gc');

get_owner_by_gid = function(gid){
	console.log("get_owner_by_gid called");
	var temp = list_of_games.length;
		for (var i = 0; i < temp; i++){
			if (list_of_games[i].get_gameID() == gid){
				return list_of_games[i];
				//console.log(list_of_games[i]);
			}
			else {
				//console.log(list_of_games[i].get_gameID());
				//console.log(list_of_games[i].game_ID, gid);
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
			if(g1.get_full()){
				socket.emit('GameIDExists.','The game with GameID '+ g1.game_ID+ ' is full. Try after sometime!!');
			}
			else{
				socket.pid=PlayerID;
				g1.server_add_player(socket);
				socket.game_instance=g1;
				var new_new_daata = data;
				new_new_daata.noOfPlayers = g1.get_max_nop();
				socket.emit('join_success', new_new_daata);
				if(g1.get_full()){
					g1.start_start();
				}
			}
		}
		else {
			var g1 = new game(Game_ID, NoOfPlayers, true);
			list_of_games.push(g1);
			socket.pid=PlayerID;
			g1.server_add_player(socket);
			socket.game_instance=g1;
			socket.emit('join_success', data);
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