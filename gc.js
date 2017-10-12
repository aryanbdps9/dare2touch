var gc = function(gid, nop = 2, isServer = false){
	console.log("new gc created");
	// var grid = new grid_require(480, 720);
	// this.nor = 480, this.noc = 720;
	this.nor = 100, this.noc = 200;
	// var grid_require = require('./grid');
	// var grid = new grid_require('nor, noc');
	this.grid = undefined;
	if (isServer){
		var grid_require = require('./grid');
		this.grid = new grid_require(this.nor, this.noc);
		console.log("grid created.");
		// console.log(grid);
	}

	else{
		this.grid = new Grid(this.nor, this.noc);
	}
	this.isServer = isServer;
	this.full = false;
	this.current_nop = 0;
	this.max_nop = nop;
	this.server_player_obj_list = [];
	this.update_switch = undefined;
	this.interval = 100; // time after which kallar is called;
	this.self = this;
	this.started = false;
	this.game_ID = gid;
	this.cutoff = 5;

	console.log("game_ID set to ", this.game_ID, "\tgid is ", gid);

//	initial_procedure:



	if (!this.isServer){
		this.myid;
		this.client_last_input_string = '';
		this.config_connection();
	}


	if (!this.isServer){
			console.log("keyboard !!!!!!!!!!");
			var seld = this;
			window.addEventListener("keydown", function(event){
				var keyNm = event.keyCode || event.which;
				if ([37, 38, 39, 40, 65, 68, 83, 87].indexOf(keyNm) > -1){
					event.preventDefault();
				}
				if (seld.started){
					var pressed = false;
					var temp_seq = "";
					
					if (keyNm == 37 || keyNm == 65){
						//left
						temp_seq = "0#-1";
						pressed = true;
					}
					else if (keyNm == 38 || keyNm == 87){
						//up
						temp_seq = "-1#0";
						pressed = true;
					}
					else if (keyNm == 39 || keyNm == 68){
						//right
						temp_seq = "0#1";
						pressed = true;
					}
					else if (keyNm == 40 || keyNm == 83){
						//down
						temp_seq = "1#0";
						pressed = true;
					}
					temp_seq = seld.grid.get_actual_up_no().toString() + "#" + seld.myid.toString() + "#" + temp_seq;
					console.log("my id is:", seld.myid);
					if (pressed){
						seld.client_last_input_string = temp_seq;
					}
				}
			});
		
	}

};

gc.prototype.get_max_nop = function(){
	return this.max_nop;
};

gc.prototype.get_isServer = function(){
	return this.isServer;
};

gc.prototype.get_grid = function(){
	return this.grid;
};

gc.prototype.get_nor = function(){
	return this.nor;
};

gc.prototype.get_noc = function(){
	return this.noc;
};

gc.prototype.get_gameID = function(){
	return this.game_ID;
};

gc.prototype.set_gameID = function(newgid){
	console.log("changing game_ID. Old game_ID = ", this.game_ID);
	this.game_ID = newgid;
	console.log("new game_ID = ", this.game_ID);
};

gc.prototype.get_full = function(){
	return this.full;
};

gc.prototype.get_current_nop = function(){
	return this.current_nop;
};

gc.prototype.get_server_player_obj_list = function(){
	return this.server_player_obj_list;
};

gc.prototype.get_update_switch = function(){
	return this.update_switch;
};

gc.prototype.get_started = function(){
	return this.started;
};
gc.prototype.server_add_player = function(player){
	console.log("server_add_player called");	
	// here player is the socket obj and it contains pid
	this.server_player_obj_list.forEach(function(p){
		p.emit('s_add_player', player.pid);
	});
	this.server_player_obj_list.forEach(function(p){
		player.emit('s_add_player', p.pid);
	});
	this.grid.add_player(player.pid);
	this.server_player_obj_list.push(player);
	//console.log("player list is", this.server_player_obj_list);
	this.current_nop++;
	if (this.current_nop == this.max_nop){
		this.full = true;
	}
	console.log("current_nop:" , this.current_nop, "\tmax_nop:", this.max_nop, "\tfull=", this.full);
};

gc.prototype.client_add_player = function(pid){
	this.grid.add_player(pid);
};

gc.prototype.start_start = function(){
	this.server_player_obj_list.forEach(function(p){
		p.emit('starting_game');
	});
	//console.log("this is:", this);
	var self=this;
	setTimeout(function(){self.start_updating(self);}, 3000);
};

	

gc.prototype.client_count_display = function(){

}
// }


gc.prototype.start_updating = function(self){
	console.log("start_updating called");
	//var self = self;
	//console.log("this of su: ", this);
	//console.log("self is:", self);
	// console.log("interval: ", this.interval);
	if (self.isServer){
		console.log("server part being called");
		console.log(self.get_isServer());
		self.server_player_obj_list.forEach(function(p){
			p.emit('game_start');
			// self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		});
		self.grid.make_ready_for_update();
		//var self = this;
		// this.update_switch = setInterval(this.kallar, this.interval);
		self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		self.started = true;
	}
	else{
		console.log("client part being called");
		console.log(self.get_isServer());
		//var self=this;
		self.grid.make_ready_for_update();
		self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		self.started = true;
	}
	console.log("end of start_updating");
};


gc.prototype.add_sequence = function(seq, self){
	if (self.isServer){
		console.log("adding sequence in server");
		self.server_player_obj_list.forEach(function(p){
			p.emit('move', seq);
		});
		self.grid.add_sequence(seq);
	}
	else {
		self.grid.add_sequence(seq);
		console.log("adding sequence in client");
	}
};

/*gc.prototype.client_onconnected = function(data){
	var myid = data.playerID;
	this.max_nop = data.noOfPlayers;
	this.myid = myid;
	this.client_add_player(this.myid);
}*/

gc.prototype.input_data_parser = function(inp_string){
	var temp_list = inp_string.split("#");
	var type_casted_temp_list = [parseInt(temp_list[0]), parseInt(temp_list[1])];
	var temp_dir_list = [parseInt(temp_list[2]), parseInt(temp_list[3])];
	type_casted_temp_list.push(temp_dir_list);
	temp_dir_list = undefined;
	return type_casted_temp_list;
};

/*gc.prototype.client_handle_move = function(self, data){
	// data will be of following format:
	// str(update_no-pid-x-y) // str means string
	var temp_list = self.input_data_parser(data);
	self.grid.add_sequence(data);
	// type_casted_temp_list = undefined;
};*/


gc.prototype.client_handle_input = function(){
	var temp_str = this.client_last_input_string;
	var temp_seq = this.client_last_input_string.split("#");
	var pressed = false;
	if (temp_seq.length > 1){
		this.client_last_input_string = "";
		return {pressed:true, data_string:temp_str};
	}
	else return {pressed:false, data_string:""};
};

gc.prototype.server_input_handle = function(data, player){
	console.log("input_handle, player: ");
	// console.log(player);
	var temp_list = this.input_data_parser(data);
	var request_u_n = temp_list[0];
	var current_un = this.grid.get_actual_up_no();
	var lo_lim = (current_un - this.cutoff)>=0 ? (current_un - this.cutoff) : 0;
	var up_lim = (current_un + this.cutoff);
	//if ((request_u_n >= lo_lim) && (request_u_n <= up_lim)){
		this.add_sequence(temp_list, this);
		player.emit('accepted_inp_seq', request_u_n);
	//}
	//else{
	//	player.emit('rejected', request_u_n);
	//}
	
}


gc.prototype.kallar = function(self){

	console.log("kallar was called");
	// console.log("alive players", self.grid.get_alive_players());
	if (self.grid.get_alive_players().length == 0){
		clearInterval(self.update_switch);
		console.log("update_switch is not working", self.update_switch);
		self.grid.should_update=false;
	}
	// console.log("this: ", this);
	//console.log("self: ", self);
	//console.log("this.isServer: ", self.get_isServer);
	//console.log("self.isServer: ", self.get_isServer);
	//console.log("board:");
	
	if (!self.get_isServer()){
		console.log("will call renderer");
		//console.log("player list is:");
		renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts());
		console.log("called renderer");
		console.log(self.isServer);
		console.log(self.grid.get_board());
		console.log("my id is: ", self.myid);
		var c_inp = self.client_handle_input(); // c_input is of
		if (c_inp.pressed){
			//i.e. input was pressed
			var baby_inp = self.input_data_parser(c_inp.data_string);
			var last_p_dir = self.grid.get_last_move(baby_inp[1]);
			if (Math.abs(last_p_dir[0]) != Math.abs(baby_inp[2][0]) || Math.abs(baby_inp[2][1]) != Math.abs(last_p_dir[1])){
				self.socket.send(c_inp.data_string);
				self.add_sequence(self.input_data_parser(c_inp.data_string), self);
			}
			else{
				console.log("input was ignored");
			}
		}
	}
	self.grid.update();
	
	if (self.isServer){
		// console.log(self.grid.print_grid());
		if (self.grid.is_game_over()){
			self.server_player_obj_list.forEach(function(p){
				p.emit('game_over');
			});
		}
	}
};

gc.prototype.client_remove_seq = function(up_no){
	console.log("entered client_remove_seq");
	if (!this.isServer){
		this.grid.remove_seq(up_no, this.myid);
	}
}

gc.prototype.client_kill_player = function(pida){
	this.grid.remove_player(pida);
};


gc.prototype.client_ondisconnect = function(){
	if (this.update_switch != undefined){
		clearInterval(this.update_switch);
		this.update_switch = undefined;
	}
	this.grid.stop_game();
};


gc.prototype.get_socket = function(){
	//console.log("socket inside get_socket in gc:");
	//console.log(this.socket);
	return this.socket;
};

gc.prototype.client_onconnected  = function(self, data){
	var myid = data.playerID;
	self.max_nop = data.noOfPlayers;
	self.myid = myid;
	self.client_add_player(myid);
}

gc.prototype.config_connection = function(){
	var self=this;
	this.socket = io.connect();
	//console.log("socket inside gc:");
	//console.log(this.socket);
	this.socket.on('disconnect', this.client_ondisconnect); //

	//Handle when we connect to the server, showing state and storing id's.
	//On error we just show that we are not connected for now. Can print the data.
	this.socket.on('error', this.client_ondisconnect);
	this.socket.on('s_add_player', function(pid){
		self.grid.add_player(pid);
	}); //
	this.socket.on('game_start', function(){
		self.start_updating(self);
	}); //
	this.socket.on('join_success', function(data){self.client_onconnected(self, data);});
	this.socket.on('move', function(data){self.grid.add_sequence(data, self);}); //
	this.socket.on('game_over', this.client_game_over); //
	this.socket.on('killit', this.client_kill_player); 
	this.socket.on('starting_game', this.client_count_display);
	this.socket.on('rejected', this.client_remove_seq);
	this.socket.on('accepted_inp_seq', console.log('yaay! seq accepted'));
};


// module.exports = gc;

if( 'undefined' != typeof global ) {
    module.exports = global.gc = gc;
}
