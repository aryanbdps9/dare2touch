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

/*io.configure(function (){

	io.set('log level', 0);

	io.set('authorization', function (handshakeData, callback) {
	  callback(null, true); // error first callback style
	});

});*/


var list_of_games=[];
var game = require('./gc');

get_owner_by_gid = function(gid){
	//console.log("get_owner_by_gid called");
	var temp = list_of_games.length;
	//console.log("list of games:", list_of_games);
		for (var i = 0; i < temp; i++){
			if (list_of_games[i].get_gameID() == gid){
				//console.log("game:",list_of_games[i]);
				return list_of_games[i];
			}
			else {
				//console.log("Game_ID is:",list_of_games[i].get_gameID());
				//console.log("gid is", gid);
			}
		}
	}

var list_of_playerID = [];
var roomno = 0;
//var user;
io.on('connection', function(socket) {
	console.log('New user connected');
	var user;
	//if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > noofplayers-1) roomno++;
	
		socket.on('setGameID', function(data) {
		console.log("caught setGameID");
		Game_ID = data.gameID;
		PlayerID = data.playerID;
		user = PlayerID;
		NoOfPlayers = data.noOfPlayers;
		var g1 = get_owner_by_gid(Game_ID);
		var indx = list_of_games.indexOf(g1);
		//console.log("index is:",indx);
		if(list_of_games.indexOf(g1) > -1){
			//console.log("full is",g1.get_full());
			if(g1.get_full()){
				var inddd = list_of_playerID.indexOf(user);
				list_of_playerID.splice(inddd, 1);
				socket.emit('GameIDExists','The game with GameID '+ Game_ID + ' is full. Try after sometime!!');
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
			console.log("new game created");
			list_of_games.push(g1);
			socket.pid=PlayerID;
			g1.server_add_player(socket);
			socket.game_instance=g1;
			socket.emit('join_success', data);
			if(g1.get_full()){
					g1.start_start();
				}
		}
	});

	socket.on('setPlayerID', function(data){
		if(list_of_playerID.indexOf(data) > -1) {
			socket.emit('PlayerIDExists',data);
		} else {
			list_of_playerID.push(data);
			console.log("will now emit setPlayerID", data);
			socket.emit('settingPlayerID', data);
		}
	});

	socket.on('message', function(data){
		// console.log("app::: socket: ", socket);
		start1 = new Date();
		socket.game_instance.server_input_handle(data, socket);
		console.log("message detected");
	});


	socket.on('endtime', function(){
		end1 = new Date();
		timediff = end1 - start1;
		console.log(" time difference is ", timediff);
	});
	/*socket.on('msg', function(data) {
		io.sockets.in("room-"+roomno).emit('newmsg', data);
	});

	socket.on('oldmsg', function(){
		for (var i = 0; i < users[roomno-1].length - 1; i++) {
		socket.emit('oldmsg1', users[roomno-1][i]);
		}
	});*/
	/*socket.on('disconnect', function(){
		console.log("disconnectinggggggggggggggggggggggggggggggg");
		socket.emit('disconnecting');
	});*/


	socket.on('disconnect', function(){
		console.log("disconnecting");
		if(user!=undefined){
		console.log(user, ' is disconnected');
		var inddd = list_of_playerID.indexOf(user);
		list_of_playerID.splice(inddd, 1);
		console.log(user, " is removed");
	}
	});
});

http.listen(3000, function() {
	console.log('listening on localhost:3000');
});