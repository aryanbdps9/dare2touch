var express = require('express');
var app = express();

var sessions = require('express-session');
var nconnect = require('connect');
var crypto = require('crypto');

var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'kentenben11',
	database: 'Pro1'
});
var tablename = "test1";

con.connect(function(err){
	if (err) {
		console.log("Mysql error: ", err);
	}
});

// var MemoryStore = require('connect/middleware/session/memory'),
var sessionStore = new sessions.MemoryStore();

var cookieParser = require('cookie-parser')('your secret sauce');
  // , sessionStore = new nconnect.middleware.session.MemoryStore();

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser);
app.use(sessions({ secret: 'your secret sauce', store: sessionStore, resave: false, saveUninitialized: true}));
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

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

// io.configure(function (){
// 	io.set('log level', 0);
// 	// io.set('authorization', function (handshakeData, callback) {
// 	//   callback(null, true); // error first callback style
// 	// });
// });


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
sessionSockets.on('connection', function(err, socket, session) {
	console.log('New user connected');
	var user;
	//if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > noofplayers-1) roomno++;
	socket.on('setGameID', function(data) {
		if (session.loggedin){
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
		}
		else{
			console.log("client with pid ", data.playerID, " was not logged in");
			socket.emit('do_login');
		}
	});

	socket.on('setPlayerID', function(data){
		if (session.loggedin){
			console.log("basmashi in setPlayerID!");
			return;
		}
		var uide = con.escape(data.username);
		var uid = data.username;
		var pswd = data.pswd;
		var hsd_pswd = undefined;
		var data = uid;
		console.log("tablename = ", tablename);
		var sql = "SELECT username, salt, hashed_p FROM " + tablename + " WHERE username = " 
		+ uide + " LIMIT 1";
		console.log("uid = ", uid);
		console.log("mysql query string: ", sql);
		var actps = undefined;
		con.query(sql, function(err, results, fields){
			if (err) console.log(err);
			if (results.length == 0){
				socket.emit("do_login");
			}
			else{
				actps = results[0].hashed_p;
				console.log("actps = ", actps);
				hsd_pswd = crypto.createHash('sha256').update(results[0].salt + pswd).digest('hex');
				console.log("hash stored is: ", actps);
				if(list_of_playerID.indexOf(data) > -1) {
					socket.emit('PlayerIDExists',data);
				} else if (hsd_pswd == actps){
					session.loggedin = true;
					session.pid = uid;
					list_of_playerID.push(data);
					console.log("will now emit setPlayerID", data);

					socket.emit('settingPlayerID', data);
				}
				else{
					console.log("chor aaya tha, key tha: ", pswd);
					socket.emit("re_enter_credentials");
				}
			}
		});
		
	});

	socket.on('create_player', function(data){
		if (session.loggedin){
			console.log("basmashi in create_player!");
			return;
		}
		var uide = con.escape(data.username);
		var uid = data.username;
		var pswd = data.pswd;
		var hsd_pswd = undefined;
		var data = uid;
		console.log("tablename = ", tablename);
		var sql = "SELECT username FROM " + tablename + " WHERE username = " 
		+ uide + " LIMIT 1";
		console.log("uid = ", uid);
		console.log("mysql query string: ", sql);

		con.query(sql, function(err, results, fields){
			if (err) console.log(err);
			if (results.length != 0){
				console.log("user exists");
				socket.emit("do_login"); // user_exists
			}
			else{
				var hash_p = crypto.createHash('sha256').update(data + pswd).digest('hex');
				var sql2 = "INSERT into " + tablename + "(username, salt, hashed_p) VALUES (" + uide
				+ ", " + uide + ", " + con.escape(hash_p) + ")"; 
				console.log("mysql query string: ", sql2);
				con.query(sql2, function(err, results){
					if (err) throw err;
					socket.emit("do_login");
				});
			}
		});

	});

	socket.on('message', function(data){
		// console.log("app::: socket: ", socket);
		if (session.loggedin){
			var temp_list = data.split("#");
			if (temp_list.length != 4){
				console.log("chutiya detected");
			}
			else if (temp_list[1] == session.pid){
				socket.game_instance.server_input_handle(data, socket);
				console.log("message detected");
			}
		}
		else{
			socket.emit('do_login');
		}
	});

	socket.on('disconnect', function(){
		console.log("disconnecting");
		if(user!=undefined){
			console.log(user, ' is disconnected');
			var inddd = list_of_playerID.indexOf(user);
			list_of_playerID.splice(inddd, 1);
			console.log(user, " is removed");
			if (socket.loggedin){
				if (socket.game_instance != undefined){
					socket.game_instance.server_remove_player(session.pid);
				}
			}
			session.loggedin = false;
			session.destroy();
		}
	});
});

http.listen(3000, function() {
	console.log('listening on localhost:3000');
});