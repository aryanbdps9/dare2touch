function gplayer(){
	this.the_id = undefined;
	this.inipos = undefined;
	this.finalpos = undefined;
	this.finaldir = undefined; 
	this.last_killed = Infinity;
	this.trace = [];
	this.pnts = 0;
	// trace won't include the point of death
}

function lattice(una, pid, dirn){
	this.un = una;
	this.pid = pid;
	this.dir = dirn;
}


function Grid(nora, noca){
	var self = this;
	this.grid_num_row = nora;
	this.grid_num_col = noca;
	this.ini_list_pid_and_pnts = [];
	this.seq_of_moves = [];
	this.seq_of_unprocessed_moves = [];
	this.current_update_number = 0;
	this.actual_current_up_no = 0;
	this.current_gplayers = [];
	this.killed_gplayers = [];
	this.should_update = false;
	this.board = [];

	this.clear_board() = function(){
		board = [];
		each_row = new Array(grid_num_col);
		for (var i = 0; i < grid_num_col; i++){
			each_row[i] = undefined;
		}
		for(var i = 0; i < grid_num_row; i++){
			grid[i] = each_row.slice(0);
		}
	}
	this.add_player(pid) = function(){
		var present = false;
		for (var i = 0; i < ini_list_pid_and_pnts.length; i++){
			if (ini_list_pid_and_pnts[i][0] == pid){
				present = true;
				break;
			}
		}
		if (!present){
			ini_list_pid_and_pnts.push([pid, 0]);
		}
	}
	this.initialize_players() = function(){
		self.clear_board();
		//create and position players()
		this.c_position_players();
	}
	this.c_position_players() = function(){
		var cppx = [];
		var cppy = [];
		var cppdiri = [];
		var cppiniposi = [];
		var cpplen = self.ini_list_pid_and_pnts.length;
		if (cpplen == 1){
			cppx.push(Math.floor(grid_num_col/2));
			cppy.push(Math.floor(grid_num_row / 2));
			cppdiri.push([0, 1]);
			cppiniposi.push([cppx[0], y[0]]);
		}
		else if (cpplen == 2){
			cppx.push(Math.floor(grid_num_col/4));
			cppx.push(Math.floor(grid_num_col*3/4));
			cppy.push(Math.floor(grid_num_row / 2));
			cppdiri.push([0, 1]);
			cppdiri.push([0, 1]);
			cppiniposi.push([cppx[0], y[0]]);
			cppiniposi.push([cppx[1], y[0]]);
		}
		for(var i = 0; i < cpplen; ++i){
			create_and_set_player_at(self.ini_list_pid_and_pnts[i][0], cppiniposi[i], cppdiri[i]);
		}
		return;
		
	}
	this.create_and_set_player_at(pid, inipos, dir){
		// Creating gplayer
		var babyGplayer = new gplayer();
		babyGplayer.the_id = pid;
		babyGplayer.inipos = inipos;
		babyGplayer.finalpos = inipos;
		babyGplayer.finaldir = dir;
		babyGplayer.trace.push([0, inipos, dir]);
		//adding it to list of current players;
		current_gplayers.push(babyGplayer);
		var x0 = inipos[0];
		var y0 = inipos[1];
		// Placing on board
		self.board[x0][y0] = new lattice(0, pid, dir);
		return;
	}

	this.get_alive_players(){
		return current_gplayers;
	}

	this.update(){
		// returning 0 means false, 1 means true, and 10 means game over
		if (!should_update){
			return 0;
		}
		else if (current_gplayers.length < 2){
			return 10;
		}
		// else:
		actual_current_up_no++;
		var update_update_number = current_update_number;
		if (!seq_of_unprocessed_moves.empty()){
			update_update_number = seq[0][0];
		}
		// incomplete hai, due to aalas

	}

	this.get_killed_list(){
		return killed_gplayers;
	}

	this.add_sequence(seq){
		should_update = false;
		//again ditched due to aalas
	}

	this.make_ready_for_update(){
		initialize_players();
		should_update = true;
	}

	this.oracle(seq){
		oracle_update_number = seq[0];
		respawn_dead(oracle_update_number);
		oracle_clear_board_from(oracle_update_number);
		oracle_change_head(seq[1], dirn);
		oracle_extrapolate(oracle_update_number);
		return;
	}
	this.oracle_clear_board_from(update_no){
		
	}
}