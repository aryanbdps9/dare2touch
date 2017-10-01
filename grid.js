function gplayer(){
	this.the_id = undefined;
	this.inipos = undefined;
	this.finalpos = undefined;
	this.finaldir = undefined; 
	this.last_killed = Infinity;
	this.trace = []; // {update_no_personal, pos[], direction}
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
	var grid_num_row = nora;
	var grid_num_col = noca;
	var ini_list_pid_and_pnts = [];
	var seq_of_moves = [];
	var seq_of_unprocessed_moves = [];
	var current_update_number = 0;
	var actual_current_up_no = 0;
	var current_gplayers = [];
	var killed_gplayers = [];
	var should_update = false;
	var board = [];

	var initialized = false;

	this.add_player = function(pid){
		var present = false;
		for (var i = 0; i < ini_list_pid_and_pnts.length; i++){
			if (ini_list_pid_and_pnts[i][0] == pid){
				present = true;
				break;
			}
		}
		if (!present){
			console.log("pushing " + pid + "\n");
			ini_list_pid_and_pnts.push([pid, 0]);
			// console.log(ini_list_pid_and_pnts + ": ini_list_pid_and_pnts");
		}
		return ini_list_pid_and_pnts;
	}

	this.make_ready_for_update = function(){
		self.initialize_players();
		should_update = true;
	}

	this.add_sequence = function(seq){
		should_update = false;
		var i = self.finder(seq[0], seq_of_moves, 0);
		if (i == seq_of_moves.length){
			console.log("No change in processed!");
			if (seq_of_unprocessed_moves.length > 0){
				var j = self.finder(seq[0], seq_of_unprocessed_moves, 0);
				seq_of_unprocessed_moves.splice(j, 0, seq);
				should_update = true;
				return;
			}
			else{
				console.log('directly pushed');
				seq_of_unprocessed_moves.push(seq);
				should_update = true;
				return;
			}
		}
		else{
			temp_array = seq_of_moves.splice(i, seq_of_moves.length - i);
			seq_of_unprocessed_moves.splice.apply(seq_of_unprocessed_moves, [0, 0].concat(temp_array));
			seq_of_unprocessed_moves.unshift(seq); // inserted at the beginning
			should_update = true;
			return;
		}
	}

	this.get_seq_of_moves = function(){
		return seq_of_moves;
	}

	this.get_seq_of_unprocessed_moves = function(){
		return seq_of_unprocessed_moves;
	}

	this.clear_board = function(){
		board = [];
		each_row = new Array(grid_num_col);
		for (var i = 0; i < grid_num_col; i++){
			each_row[i] = undefined;
		}
		for(var i = 0; i < grid_num_row; i++){
			board[i] = each_row.slice(0);
		}
	}


	this.get_board = function(){
		return board;
	}

	this.get_alive_players = function(){
		return current_gplayers;
	}

	this.update = function(){
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
		if (seq_of_unprocessed_moves.length > 0){
			update_update_number = seq_of_unprocessed_moves[0][0];
		}

		//finder(what, in_this_list, ith_elem_of_each_elem)
		var i = self.finder(update_update_number, seq_of_moves, 0);
		if (i != seq_of_moves.length) {
			// a1 = [1,2,3,4,5];
			// a2 = [21,22];
			// a1.splice.apply(a1, [2, 0].concat(a2));
			// console.log(a1); // [1, 2, 21, 22, 3, 4, 5];
			// moving all elem from i onwards into the beginning of seq_of_unprocessed_moves
			console.log("######################");
			console.log("seq_om:", seq_of_moves);
			console.log("seq_oum:", seq_of_unprocessed_moves);
			console.log("shifting all elems with indices >= ", i, " from seq_om to seq_oum");
			temp_array = seq_of_moves.splice(i, seq_of_moves.length - i);
			seq_of_unprocessed_moves.splice.apply(seq_of_unprocessed_moves, [0, 0].concat(temp_array));
			console.log("seq_om:", seq_of_moves);
			console.log("seq_oum:", seq_of_unprocessed_moves);
			console.log("######################");
		}
		else {
			console.log("len of seq_om = ", seq_of_moves.length, "; result of finder = ", i)
			console.log("seq_om: ", seq_of_moves)
		}

		while(seq_of_unprocessed_moves.length > 0){
			if (seq_of_unprocessed_moves.length > 1) current_update_number = seq_of_unprocessed_moves[1][0];
			else{
				current_update_number = actual_current_up_no;
			}
			self.oracle(seq_of_unprocessed_moves[0]);
			tempseq = seq_of_unprocessed_moves.shift();
			if (tempseq != undefined){
				seq_of_moves.push(tempseq);
			}
		}

		if (actual_current_up_no != current_update_number){
			cur_n = current_update_number;
			current_update_number = actual_current_up_no;
			self.oracle_extrapolate(cur_n);
		}
		return 1;
	}

	this.get_killed_list = function(){
		return killed_gplayers;
	}


	this.print_grid = function(){
		if (!initialized){
			console.log("Empty grid of size" + grid_num_row + " x " + grid_num_col);
		}
		else{
			for (var rr = 0; rr < grid_num_row; rr++){
				r = board[rr];
				for (var i = 0; i < grid_num_col; i++){
					var e = r[i];
					if (e == undefined){
						// console.log("u ", ";     ");
						process.stdout.write("     " + " u;");
						continue;
					}
					// console.log(e.pid, ", ", e.un , ";    ");
					process.stdout.write("   " + e.pid + ", " + e.un+";");
				}
				process.stdout.write("\n");
			}
		}
	}



	this.initialize_players = function(){
		self.clear_board();
		//create and position players()
		self.c_position_players();
		initialized = true;
	}

	this.get_ini_list_pid_and_pnts = function(){
		return ini_list_pid_and_pnts;
	}

	this.c_position_players = function(){
		var cppx = [];
		var cppy = [];
		var cppdiri = [];
		var cppiniposi = [];
		// return ini_list_pid_and_pnts;
		var cpplen = ini_list_pid_and_pnts.length;
		if (cpplen == 1){
			cppy.push(Math.floor(grid_num_col/2));
			cppx.push(Math.floor(grid_num_row / 2));
			cppdiri.push([-1, 0]);
			cppiniposi.push([cppx[0], cppy[0]]);
		}
		else if (cpplen == 2){
			cppy.push(Math.floor(grid_num_col/4));
			cppy.push(Math.floor(grid_num_col*3/4));
			cppx.push(Math.floor(grid_num_row / 2));
			cppdiri.push([-1, 0]);
			cppdiri.push([-1, 0]);
			cppiniposi.push([cppx[0], cppy[0]]);
			cppiniposi.push([cppx[0], cppy[1]]);
		}
		for(var i = 0; i < cpplen; ++i){
			console.log("caspa i = " + i + "\n");
			self.create_and_set_player_at(ini_list_pid_and_pnts[i][0], cppiniposi[i], cppdiri[i]);
		}
		return;
	}

	this.create_and_set_player_at = function(pid, inipos, dir){
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
		var caspa_latt = new lattice(0, pid, dir);
		board[x0][y0] = caspa_latt;
		return;
	}

	this.oracle = function(seq){
		var oracle_update_number = seq[0];
		self.respawn_dead(oracle_update_number);
		self.oracle_remove_pseudo_future_trace_from_players();
		self.oracle_clear_board_from(oracle_update_number);
		self.oracle_change_new_head(seq[1], seq[2]);
		self.oracle_extrapolate(oracle_update_number);
		return;
	}

	this.respawn_dead = function(from_this_time){
		var birth_list = [];
		killed_gplayers.forEach(function(p){
			if (p.last_killed >= from_this_time){
				if (!birth_list.includes(p)){
					birth_list.push(p);
					var index = killed_gplayers.findIndex(p);
					killed_gplayers.splice(index,1);
				}
			}
		});
		birth_list.forEach(function(p){
			if (!current_gplayers.includes(p)){
				current_gplayers.push(p);
				p.last_killed = Infinity;
			}
		});
		birth_list = undefined;
	}

	this.oracle_remove_pseudo_future_trace_from_players = function(after){
		current_gplayers.forEach(function(p){
			var ptl = p.trace.length;
			var rmi = p.trace.length;
			for (var i = ptl - 1; i >= 0; i--) {
				if (p.trace[i][0] <= after){
					rmi = i + 1;
					break;
				}
			}
			p.trace.splice(rmi, ptl - rmi);
			p.finalpos = p.trace[rmi - 1][1];
			p.finaldir = p.trace[rmi - 1][2];
		});
		return;
	}


	this.oracle_clear_board_from = function(update_no){
		for (var rr = 0; rr < grid_num_row; rr++){
			ro = board[rr];
			for (var i = 0; i < ro.length; i++) {
				if (ro[i] != undefined && ro[i][0] > update_no){
					ro[i] = undefined;
				}
			}
		}
	}

	this.oracle_change_new_head = function(pida, dirna){
		for (var kl = 0; kl < current_gplayers.length; kl++){
			if (current_gplayers[kl].the_id == pida){
				current_gplayers[kl].finaldir = dirna;
				return;
			}
		}
	}

	this.oracle_extrapolate = function(from_this_no){
		var cnt = from_this_no;
		while (cnt < current_update_number){
			self.move(cnt);
			//remove_killed_from_board(); done in kill only
			cnt++;
		}
	}

	this.move = function(curr_time){
		var kill_list = [];
		current_gplayers.forEach(function (p){
			var hd = p.finalpos;
			var arrow = p.finaldir;
			var newpos = [(hd[0] + arrow[0]), (hd[1] + arrow[1])];
			var host;
			if (self.is_out_of_range(newpos)){
				//kill(p);
				console.log("is_out_of_range! newpos = ");
				console.log(newpos + "\tplayerid = "+ p.the_id+ "\n");
				// console
				kill_list.push(p);
			}
			else{
				host = board[newpos[0]][newpos[1]];
			}
			if (host != undefined){ // i.e. host has some owner
				if (host.pid == p.the_id){
					console.log("self killed!\n");
					kill_list.push(p);
				}
				else if (host.un == curr_time){
					kill_list.push(self.get_owner_by_pid(host.pid));
					kill_list.push(p);
					console.log("plr " +p.the_id+ " and plr" + self.get_owner_by_pid(host.un) + " killed\n");
				}
				else{
					kill_list.push(p);
					pp = self.get_owner_by_pid(host.pid);
					pp.pnts += 1;
					for(var i = 0; i < ini_list_pid_and_pnts.length; i++){
						if (ini_list_pid_and_pnts[i][0] == host.pid){
							ini_list_pid_and_pnts[i][1] += 1;
							break;
						}
					}
				}
			}

			if (!kill_list.includes(p)){
				console.log("entered pushing region\n");
				board[newpos[0]][newpos[1]] = new lattice((curr_time+1), p.the_id, arrow);
				p.finalpos = newpos;
				p.trace.push([(curr_time+1), newpos, arrow]);
			}else{
				console.log(JSON.stringify(kill_list));
			}
		});


		for (var a in kill_list){
			self.kill(a, curr_time+1);
		}
	}

	this.kill = function(plr, time_of_death){
		var indx = current_gplayers.indexOf(plr)
		if (indx > -1){
			var oddd = current_gplayers.splice(indx, 1);
			if (!killed_gplayers.includes(oddd)){
				killed_gplayers.push(oddd);
				oddd.last_killed = time_of_death;
			}

			//now remove plr from board
			for (i in oddd.trace){
				var target_pos_x = i[1][0];
				var target_pos_y = i[1][1];
				board[target_pos_x][target_pos_y] = undefined;
			}
			var otl = oddd.trace.length;
			if (otl > 0){
				if (oddd.trace[otl-1] == time_of_death){
					oddd.trace.pop();
					if (otl != 1){
						oddd.finalpos = oddd.trace[otl-2];
					}
					else{
						oddd.finalpos = oddd.inipos;
					}
				}
			}
		}
	}

	this.is_out_of_range = function(inp_pos){
		ioor_x = inp_pos[0];
		ioor_y = inp_pos[1];
		if (ioor_x < 0 || ioor_x >= grid_num_row) return true;
		else if (ioor_y < 0 || ioor_y >= grid_num_col) return true;
		else {
			return false;
		}
	}

	this.get_owner_by_pid = function(pida){
		var cgl = current_gplayers.length
		var kgl = killed_gplayers.length
		for (var i = 0; i < cgl; i++){
			if (current_gplayers[i] == pida){
				return current_gplayers[i];
			}
		}
		for (var i = 0; i < kgl; i++){
			if (killed_gplayers[i] == pida){
				return killed_gplayers[i];
			}
		}
	}

	this.finder = function(what, in_this_list, ith_elem_of_each_elem){
		//finds the smallest index r such that ith_elem_of_each_elem of elem at index at r
		// is >= what and returns it
		if (in_this_list.length == 0) return 0;
		if (in_this_list[in_this_list.length - 1][ith_elem_of_each_elem] < what) return in_this_list.length;

		 var finder_help = function(start_ind, end_ind){
			mid_ind = Math.floor((start_ind + end_ind)/2); 
			if (in_this_list[mid_ind] < what){
				return finder_help(mid_ind+1, end_ind);
			}
			else if (mid_ind == 0 || in_this_list[mid_ind-1] < what){
				return mid_ind;
			}
			else{
				return finder_help(start_ind, mid_ind);
			}
		}

		res = finder_help(0, in_this_list.length);
		return res;
	}

	this.get_actual_up_no = function(){
		return actual_current_up_no;
	}

	this.killed_pid_list = function(){
		killed_list = [];
		for (var p in killed_gplayers){
			killed_list.push(p.the_id);
		}
		return killed_list;
	}

	this.ini_player_list_length = function(){
		return ini_list_pid_and_pnts.length;
	}

	this.debug_ini = function(){
		self.add_player(1);
		self.add_player(2);
		self.make_ready_for_update();
		self.update();
		self.update();
	}
}

module.exports = Grid;
