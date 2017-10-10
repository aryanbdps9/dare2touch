var gc = function(gid, nop = 2, isServer = false){
	console.log("new gc created");
	// var grid = new grid_require(480, 720);
	this.nor = 480, this.noc = 720;
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
	this.interval = 1000; // time after which kallar is called;
	this.self = this;
	this.started = false;
	this.game_ID = gid;

	console.log("game_ID set to ", this.game_ID, "\tgid is ", gid);

//	initial_procedure:



	if (!isServer){
		this.myid;
		this.client_last_input_string = '';
		this.config_connection();
	}


	if (!isServer){
		if (this.started){
			document.addEventListener('keydown', function(event){
				if (this.started){
					var pressed = false;
					var temp_seq = "";
					var keyNm = event.keyCode || event.which;
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
					else if (keyNm == 37 || keyNm == 68){
						//right
						temp_seq = "0#1";
						pressed = true;
					}
					else if (keyNm == 40 || keyNm == 83){
						//down
						temp_seq = "1#0";
						pressed = true;
					}
					temp_seq = grid.get_actual_up_no().toString() + "#" + this.myid.toString() + "#" + temp_seq;
					if (pressed){
						this.client_last_input_string = temp_seq;
					}
				}
			});
		}
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
	this.server_player_obj_list.push(player);
	this.current_nop++;
	if (this.current_nop == this.max_nop){
		this.full = true;
	}
	console.log("current_nop:" , this.current_nop, "\tmax_nop:", this.max_nop, "\tfull=", this.full);
};

/*gc.prototype.client_add_player = function(pid){
	this.grid.add_player(pid);
};*/

gc.prototype.start_start = function(){
	this.server_player_obj_list.forEach(function(p){
		p.emit('starting_game');
	});
	console.log("this is:", this);
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
	console.log("self is:", self);
	// console.log("interval: ", this.interval);
	if (self.isServer){
		console.log("server part being called");
		console.log(self.get_isServer());
		self.server_player_obj_list.forEach(function(p){
			p.emit('game_start');
			self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		});
		//var self = this;
		// this.update_switch = setInterval(this.kallar, this.interval);
		self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		self.started = true;
	}
	else{
		console.log("client part being called");
		console.log(self.get_isServer());
		//var self=this;
		self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
		self.started = true;
	}
	console.log("end of start_updating");
};


gc.prototype.add_sequence = function(seq){
	this.grid.add_sequence(seq);
	if (this.isServer){
		server_player_obj_list.forEach(function(p){
			p.emit('move', {pid:p.pid, dirn:dirn});
		});
	}
};

gc.prototype.client_handle_move = function(data){
	// data will be of following format:
	// str(update_no-pid-x-y) // str means string
	var temp_list = this.input_data_parser(data);
	this.add_sequence(temp_list);
	// type_casted_temp_list = undefined;
};


gc.prototype.input_data_parser = function(inp_string){
	var temp_list = inp_string.split("#");
	var type_casted_temp_list = [parseInt(temp_list[0]), parseInt(temp_list[1])];
	var temp_dir_list = [parseInt(temp_list[2]), parseInt(temp_list[3])];
	type_casted_temp_list.push(temp_dir_list);
	temp_dir_list = undefined;
	return type_casted_temp_list;
};


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




gc.prototype.kallar = function(self){

	console.log("kallar was called");
	// console.log("this: ", this);
	console.log("self: ", self);
	//console.log("this.isServer: ", self.get_isServer);
	//console.log("self.isServer: ", self.get_isServer);
	if (!self.get_isServer){
		renderer (self.grid, self.nor, self.noc);
		console.log(self.isServer)
		var c_inp = self.client_handle_input(); // c_input is of
		if (c_inp.pressed){
			//i.e. input was pressed
			self.socket.send(c_inp.data_string);
			self.add_sequence(input_data_parser(c_inp.data_string));
		}
	}
	self.grid.update();
	if (self.isServer){
		if (self.grid.is_game_over()){
			server_player_obj_list.forEach(function(p){
				p.emit('game_over');
			});
		}
	}
};



gc.prototype.client_kill_player = function(pida){
	this.grid.remove_player(pida);
};


gc.prototype.client_ondisconnect = function(){
	if (this.update_switch != undefined){
		clearInterval(update_switch);
		this.update_switch = undefined;
	}
	this.grid.stop_game();
};

// gc.prototype.client_onconnected = function(data){
/*gc.prototype.client_onconnected = function(){
	// if (data.nop){
	// 	this.max_nop = nop;
	// }
	var myid = data.playerID;
	this.max_nop = data.noOfPlayers;
	this.myid = myid;
	this.client_add_player(this.myid);
};
*/
gc.prototype.get_socket = function(){
	console.log("socket inside get_socket in gc:");
	console.log(this.socket);
	return this.socket;
};

gc.prototype.config_connection = function(){
	var self=this;
	this.socket = io.connect();
	console.log("socket inside gc:");
	console.log(this.socket);
	this.socket.on('disconnect', this.client_ondisconnect); //

	//Handle when we connect to the server, showing state and storing id's.
	this.socket.on('onconnected', function(data){
		var myid = data.playerID;
		this.max_nop = data.noOfPlayers;
		this.myid = myid;
		this.client_add_player(this.myid);
	});//
	//On error we just show that we are not connected for now. Can print the data.
	this.socket.on('error', this.client_ondisconnect);
	this.socket.on('s_add_player', function(pid){
		self.grid.add_player(pid);
	}); //
	this.socket.on('game_start', function(){
		self.start_updating(self);
	}); //
	this.socket.on('move', this.client_handle_move); //
	this.socket.on('game_over', this.client_game_over); //
	this.socket.on('killit', this.client_kill_player); 
	this.socket.on('starting_game', this.client_count_display);
};


// module.exports = gc;

if( 'undefined' != typeof global ) {
    module.exports = global.gc = gc;
}
