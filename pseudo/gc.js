function gc(gid, nop = 2, isServer = false){
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

//	initial_procedure:
	if (!isServer){
		self.config_connection();
	}

	this.server_add_player = function(player){
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
	}

	this.client_add_player = function(pid){
		grid.add_player(pid);
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

	this.client_handle_move = function(data){
		// data will be of following format:
		// str(update_no-pid-x-y) // str means string
		var temp_list = self.input_data_parser(data);
		self.add_sequence(temp_list);
		// type_casted_temp_list = undefined;
	}

	this.input_data_parser = function(inp_string){
		var temp_list = inp_string.split("-");
		var type_casted_temp_list = [parseInt(temp_list[0]), parseInt(temp_list[1])];
		var temp_dir_list = [parseInt(temp_list[2]), parseInt(temp_list[3])];
		var type_casted_temp_list.push(temp_dir_list);
		temp_dir_list = undefined;
		return type_casted_temp_list;
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

	this.config_connection(){
		self.socket = io.socket();
		self.socket.on('disconnect', this.client_ondisconnect);

		//Handle when we connect to the server, showing state and storing id's.
		self.socket.on('onconnected', this.client_onconnected);

		//On error we just show that we are not connected for now. Can print the data.
		self.socket.on('error', self.client_ondisconnect);
		self.socket.on('s_add_player', self.client_add_player); #
		self.socket.on('game_start', self.start_updating); #
		self.socket.on('move', self.client_handle_move); #
		self.socket.on('game_over', self.client_game_over); #
		self.socket.on('killit', self.client_kill_player);
	}
}