gc = function(gid, nop = 2){
	console.log("new gc created");
	// var grid = new grid_require(480, 720);
	// this.nor = 480, this.noc = 720;
	this.nor = 100, this.noc = 200;
	// var grid_require = require('./grid');
	// var grid = new grid_require('nor, noc');
	this.grid = new Grid(this.nor, this.noc);
	this.full = false;
	this.current_nop = 0;
	this.max_nop = nop;
	this.interval = 100; // time after which kallar is called;
	// this.self = this;
	this.started = false;
	this.game_ID = gid;
	this.game_over_time = 0;
	this.total_messages=0;

	console.log("game_ID set to ", this.game_ID, "\tgid is ", gid);

//	initial_procedure:



		this.myid;
		this.client_last_input_string = '';

};

gc.prototype.get_max_nop = function(){
	return this.max_nop;
};

gc.prototype.add_keyboard = function(){
	var seld = this;
	console.log("started is", this.started);
	if(this.started){
		window.onkeydown =  function(){
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
				console.log("myid = ", seld.myid);
				temp_seq = seld.grid.get_actual_up_no().toString() + "#" + seld.myid.toString() + "#" + temp_seq;
				console.log("my id is:", seld.myid);
				if (pressed){
					seld.client_last_input_string = temp_seq;
				}
			}
		}
	}
}

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

gc.prototype.get_started = function(){
	return this.started;
};
gc.prototype.server_add_player = function(player){
	console.log("server_add_player called");	
	// here player is the socket obj and it contains pid
	//this.grid.add_player(player.pid);
	//console.log("player list is", this.server_player_obj_list);
	// this.server_player_obj_list.forEach(function(p){
	// 	console.log("players are", self.grid.get_ini_list_pid_and_pnts());
	// 	console.log("players_connecting called");
	// 	p.emit('players_connecting', self.grid.get_ini_list_pid_and_pnts());
	// });

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
	//console.log("this is:", this);
	var self=this;
	setTimeout(function(){self.start_updating(self);}, 3000);
	// self = undefined;
};

	

gc.prototype.client_count_display = function(self){
	self.grid.make_ready_for_update();
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 3);}, 000);
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 2);}, 1000);
	setTimeout(function(){renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 1);}, 2000);
}
// }


gc.prototype.start_updating = function(self){
	startTime = new Date();
	console.log("start_updating called");
	//var self = self;
	//console.log("this of su: ", this);
	//console.log("self is:", self);
	// console.log("interval: ", this.interval);
	
	console.log("client part being called");
	//var self=this;
	//self.update_switch = setInterval(function(){self.kallar(self);}, self.interval);
	self.started = true;
	console.log("myid = ", self.myid);	
	self.add_keyboard();
	self.kallar(self);
	console.log("end of start_updating");
};


gc.prototype.add_sequence = function(seq, self){
		self.grid.add_sequence(seq);
		console.log("adding sequence in client");
};

/*gc.prototype.client_onconnected = function(data){
	var myid = data.playerID;
	this.max_nop = data.noOfPlayers;
	this.myid = myid;
	this.client_add_player(this.myid);
}*/

gc.prototype.input_data_parser = function(inp_string){
	var temp_list = inp_string.split("#");
	var type_casted_temp_list = [parseInt(temp_list[0]), temp_list[1]];
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
	this.add_sequence(temp_list, this);
	//var request_u_n = temp_list[0];
	//var current_un = this.grid.get_actual_up_no();
	//var lo_lim = (current_un - this.cutoff)>=0 ? (current_un - this.cutoff) : 0;
	//var up_lim = (current_un + this.cutoff);
	//if ((request_u_n >= lo_lim) && (request_u_n <= up_lim)){
		//player.emit('accepted_inp_seq', request_u_n);
	//}
	//else{
	//	player.emit('rejected', request_u_n);
	//}
	
}


gc.prototype.kallar = function(self){
	console.log("#####################################################");
	//console.log("kallar was called");
	// console.log("alive players", self.grid.get_alive_players());

	// console.log("this: ", this);
	//console.log("self: ", self);
	//console.log("this.isServer: ", self.get_isServer);
	//console.log("self.isServer: ", self.get_isServer);
	//console.log("board:");
	
	
	//console.log("will call renderer");
	renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), 0);
	//console.log("player list is:");
	//console.log("called renderer");
	//console.log(self.isServer);
	//console.log(self.grid.get_board());
	//console.log("my id is: ", self.myid);
	var c_inp = self.client_handle_input(); // c_input is of
	if (c_inp.pressed){
		//i.e. input was pressed
		var baby_inp = self.input_data_parser(c_inp.data_string);
		var last_p_dir = self.grid.get_last_move(baby_inp[1]);
		if (Math.abs(last_p_dir[0]) != Math.abs(baby_inp[2][0]) || Math.abs(baby_inp[2][1]) != Math.abs(last_p_dir[1])){
			self.add_sequence(self.input_data_parser(c_inp.data_string), self);
		}
		else{
			//console.log("input was ignored");
		}
	}
	//self.grid.update();

	var actual_interval=self.interval;
	var endTime = new Date();
	var time = endTime - startTime;
	get_up_no=Math.floor(time/actual_interval);
	console.log("get_up_no is ", get_up_no);
	gap_interval = time - (get_up_no*actual_interval);
	curr_interval=actual_interval - gap_interval;
	act_up_no = self.grid.get_actual_up_no();
	console.log("act_up_no is ", act_up_no);
	for(i = act_up_no; i <= get_up_no; i++ ){
		self.grid.update();
	}
	//end_time=new Date();
	//time_Diff= end_time- start_time;
	//console.log("time taken is ", time_Diff);
	if (self.grid.get_alive_players().length <= 0){
		self.game_over_time++;
	}
	else {self.game_over_time=0;}
	if(self.game_over_time>=5){
		self.grid.should_update=false;
		renderer (self.grid.get_board(), self.nor, self.noc, self.grid.get_ini_list_pid_and_pnts(), "end");
		window.onkeydown = null;
		// self.grid = null;
	}
	else {setTimeout(function(){self.kallar(self);}, curr_interval);
	console.log("total messages are ",self.total_messages);
	console.log("game id is", self.game_ID);
	self.grid.get_alive_players().forEach(function(p){
			console.log("position of ", p.the_id, " is ", p.finalpos);
			console.log("direction of ", p.the_id, " is ", p.finaldir);
		});}

};


gc.prototype.mover =function(seq, self){
	self.total_messages++;
	if(seq[1]!= self.myid){
		self.grid.add_sequence(seq, self);
		//self.socket.emit('endtime');
		}
}

gc.prototype.client_remove_seq = function(up_no){
	console.log("entered client_remove_seq");
	if (!this.isServer){
		this.grid.remove_seq(up_no, this.myid);
	}
}

gc.prototype.client_kill_player = function(self, pida){
	self.grid.remove_player(pida);
};

gc.prototype.client_onconnected  = function(self, data){
	var myid = data.playerID;
	console.log("data in client_onconnected is ", data)
	self.max_nop = data.noOfPlayers;
	self.myid = myid;
	self.client_add_player(myid);
	self.set_gameID(data.gameID);
}

// module.exports = gc;

if( 'undefined' != typeof global ) {
    module.exports = global.gc = gc;
}
