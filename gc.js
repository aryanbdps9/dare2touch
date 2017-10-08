function gc(gid, nop = 2, isServer = false){
	console.log("new gc created");
	var grid_require = require('./grid');
	// var grid = new grid_require(480, 720);
	var nor = 480, noc = 720;
	var grid = new grid_require('nor, noc');
	var full = false;
	var current_nop = 0;
	var max_nop = nop;
	var server_player_obj_list = [];
	var update_switch = undefined;
	var interval = 100; // time after which kallar is called;
	var self = this;
	started = false;
	var game_ID = gid;

	console.log("game_ID set to ", game_ID, "\tgid is ", gid);

//	initial_procedure:
	if (!isServer){
		self.myid;
		self.client_last_input_string = '';
		self.config_connection();
	}

	this.get_gameID = function(){
		return game_ID;
	}

	this.get_full = function(){
		return full;
	}

	this.server_add_player = function(player){
		console.log("server_add_player called");	
		// here player is the socket obj and it contains pid
		server_player_obj_list.forEach(function(p){
			p.emit('s_add_player', player.pid);
		});
		server_player_obj_list.forEach(function(p){
			player.emit('s_add_player', p.pid);
		});
		server_player_obj_list.push(player);
		current_nop++;
		if (current_nop == max_nop){
			full = true;
		}
		console.log("current_nop:" , current_nop, "\tmax_nop:", max_nop, "\tfull=", full);
	}

	this.client_add_player = function(pid){
		grid.add_player(pid);
	}

	this.start_start = function(){
		server_player_obj_list.forEach(function(p){
			p.emit('starting_game');
		});
		setTimeout(self.start_updating, 3000);
	}

	this.start_updating = function(){
		if (isServer){
			server_player_obj_list.forEach(function(p){
				p.emit('game_start');
				update_switch = setInterval(kallar, interval);
			});
			update_switch = setInterval(kallar, interval);
			started = true;
		}
		else{
			update_switch = setInterval(kallar, interval);
			started = true;
		}
	}

	this.add_sequence = function(seq){
		grid.add_sequence(seq);
		if (isServer){
			server_player_obj_list.forEach(function(p){
				p.emit('move', {pid:p.pid, dirn:dirn});
			});
		}
	}

	if (!isServer){
		if (started){
			document.addEventListener('keydown', function(event){
				if (started){
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
					temp_seq = grid.get_actual_up_no().toString() + "#" + self.myid.toString() + "#" + temp_seq;
					if (pressed){
						self.client_last_input_string = temp_seq;
					}
				}
			});
		}
	}

	this.client_handle_move = function(data){
		// data will be of following format:
		// str(update_no-pid-x-y) // str means string
		var temp_list = self.input_data_parser(data);
		self.add_sequence(temp_list);
		// type_casted_temp_list = undefined;
	}

	this.input_data_parser = function(inp_string){
		var temp_list = inp_string.split("#");
		var type_casted_temp_list = [parseInt(temp_list[0]), parseInt(temp_list[1])];
		var temp_dir_list = [parseInt(temp_list[2]), parseInt(temp_list[3])];
		type_casted_temp_list.push(temp_dir_list);
		temp_dir_list = undefined;
		return type_casted_temp_list;
	}

	this.client_handle_input = function(){
		var temp_str = self.client_last_input_string;
		var temp_seq = self.client_last_input_string.split("#");
		var pressed = false;
		if (temp_seq.length > 1){
			self.client_last_input_string = "";
			return {pressed:true, data_string:temp_str};
		}
		else return {pressed:false, data_string:""};
	}

	this.kallar = function(){
		if (!isServer){
			render (grid);
			c_inp = self.client_handle_input(); // c_input is of
			if (c_inp.pressed){
				//i.e. input was pressed
				self.socket.send(c_inp.data_string);
				self.add_sequence(input_data_parser(c_inp.data_string));
			}
		}
		grid.update();
		if (isServer){
			if (grid.is_game_over()){
				server_player_obj_list.forEach(function(p){
					p.emit('game_over');
				});
			}
		}
	}

	
	this.client_kill_player = function(pida){
		grid.remove_player(pida);
	}

	this.client_ondisconnect = function(){
		if (update_switch != undefined){
			clearInterval(update_switch);
			update_switch = undefined;
		}
		self.grid.stop_game();
	}

	this.client_onconnected = function(data){
		var myid = data.id;
		if (data.nop){
			self.max_nop = nop;
		}
		self.myid = myid;
		self.client_add_player(myid);
	}

	this.client_count_display = function(){

	}

	this.config_connection = function(){
		self.socket = io.connect();
		self.socket.on('disconnect', this.client_ondisconnect); //

		//Handle when we connect to the server, showing state and storing id's.
		self.socket.on('onconnected', this.client_onconnected);//
		//On error we just show that we are not connected for now. Can print the data.
		self.socket.on('error', self.client_ondisconnect);
		self.socket.on('s_add_player', self.client_add_player); //
		self.socket.on('game_start', self.start_updating); //
		self.socket.on('move', self.client_handle_move); //
		self.socket.on('game_over', self.client_game_over); //
		self.socket.on('killit', self.client_kill_player); 
		self.socket.on('starting_game', self.client_count_display);
	}
}

module.exports = gc;