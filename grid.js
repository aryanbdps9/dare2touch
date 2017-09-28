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
			board[i] = each_row.slice(0);
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
			cppiniposi.push([cppx[0], cppy[0]]);
		}
		else if (cpplen == 2){
			cppx.push(Math.floor(grid_num_col/4));
			cppx.push(Math.floor(grid_num_col*3/4));
			cppy.push(Math.floor(grid_num_row / 2));
			cppdiri.push([0, 1]);
			cppdiri.push([0, 1]);
			cppiniposi.push([cppx[0], cppy[0]]);
			cppiniposi.push([cppx[1], cppy[0]]);
		}
		for(var i = 0; i < cpplen; ++i){
			create_and_set_player_at(self.ini_list_pid_and_pnts[i][0], cppiniposi[i], cppdiri[i]);
		}
		return;
		
	}
	this.create_and_set_player_at(pid, inipos, dir) = function(pid, inipos, dir){
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

	this.get_alive_players() = function(){
		return current_gplayers;
	}

	this.update() = function(){
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
			update_update_number = seq[0][0];
		}
		// incomplete hai, due to aalas
		//finder(what, in_this_list, ith_elem_of_each_elem)
		var i = finder(update_update_number, seq_of_moves, 0);
		if (i != seq_of_moves.length) {
			// a1 = [1,2,3,4,5];
			// a2 = [21,22];
			// a1.splice.apply(a1, [2, 0].concat(a2));
			// console.log(a1); // [1, 2, 21, 22, 3, 4, 5];
			// moving all elem from i onwards into the beginning of seq_of_unprocessed_moves

			temp_array = seq_of_moves.splice(i, seq_of_moves.length - i);
			seq_of_unprocessed_moves.splice.apply(seq_of_unprocessed_moves, [0, 0].concat(temp_array));
		}

		while(seq_of_unprocessed_moves.length > 0){
			if (seq_of_unprocessed_moves.length > 1) current_update_number = seq[1][0];
			else{
				current_update_number = actual_current_up_no;
			}
			oracle(seq_of_unprocessed_moves[0]);
			seq_of_unprocessed_moves.shift();
		}

		if (actual_current_up_no != current_update_number){
			cur_n = current_update_number;
			current_update_number = actual_current_up_no;
			oracle_extrapolate(cur_n);
		}
		return 1;
	}

	this.get_killed_list() = function(){
		return killed_gplayers;
	}

	this.add_sequence(seq) = function(){
		should_update = false;
		var i = finder(seq[0], seq_of_moves, 0);
		if (i == seq_of_moves.length){
			if (seq_of_unprocessed_moves.length > 0){
				var j = finder(seq[0], seq_of_unprocessed_moves, 0);
				seq_of_unprocessed_moves.splice(j, 0, seq);
				should_update = true;
				return;
			}
			else{
				seq_of_unprocessed_moves.push(seq);
				should_update = true;
				return;
			}
		}
		else{
			// if (seq_of_unprocessed_moves.length > 0){
			// 	var j = finder(seq[0], seq_of_unprocessed_moves, 0);
			// 	seq_of_unprocessed_moves.splice(j, 0, seq);
			// }
			// else{
			// 	seq_of_unprocessed_moves.push(seq);
			// }
			temp_array = seq_of_moves.splice(i, seq_of_moves.length - i);
			seq_of_unprocessed_moves.splice.apply(seq_of_unprocessed_moves, [0, 0].concat(temp_array));
			seq_of_unprocessed_moves.unshift(seq); // inserted at the beginning
			should_update = true;
			return;
		}
	}

	this.make_ready_for_update() = function(){
		initialize_players();
		should_update = true;
	}

	this.oracle(seq) = function(){
		oracle_update_number = seq[0];
		respawn_dead(oracle_update_number);
		oracle_remove_pseudo_future_trace_from_players();
		oracle_clear_board_from(oracle_update_number);
		oracle_change_new_head(seq[1], seq[2]);
		oracle_extrapolate(oracle_update_number);
		return;
	}

	this.oracle_remove_pseudo_future_trace_from_players(after) = function(after){
		for (p in current_gplayers){
			var ptl = p.trace.length;
			int rmi = p.trace.length;
			for (var i = ptl - 1; i >= 0; i--) {
				if (p.trace[i][0] <= after){
					rmi = i + 1;
					break;
				}
			}
			p.trace.splice(rmi, ptl - rmi);
			p.finalpos = p.trace[rmi - 1][1];
			p.finaldir = p.trace[rmi - 1][2];
		}
		return;
	}


	this.oracle_clear_board_from(update_no) = function(update_no){
		for (var ro in board){
			for (var i = 0; i < ro.length; i++) {
				if (ro[i] != undefined && ro[i][0] > update_no){
					ro[i] = undefined;
				}
			}
		}
	}

	this.oracle_change_new_head(pida, dirna) = function(pida, dirna){
		for (var kl = 0; kl < current_gplayers.length; kl++){
			if (current_gplayers[kl].the_id == pida){
				current_gplayers[kl].finaldir = dirna;
				return;
			}
		}
	}

	this.oracle_extrapolate(from_this_no) = function(from_this_no){
		var cnt = from_this_no;
		while (cnt < current_update_number){
			move(cnt);
			remove_killed_from_board();
			cnt++;
		}
	}

	this.move(curr_time) = function(curr_time){
		var kill_list = [];
		for (var p in current_gplayers){
			var hd = p.finalpos;
			var arrow = p.finaldir;
			var newpos = [(hd[0] + arrow[0]), (hd[1] + arrow[1])];
			var host;
			if (is_out_of_range(newpos)){
				//kill(p);
				kill_list.push(p);
			}
			else{
				host = board[newpos[0]][newpos[1]];
			}
			if (host != undefined){ // i.e. host has some owner
				if (host[1] == p.the_id){
					kill_list.push(p);
				}
				else if (host[0] == curr_time+1){
					kill_list.push(get_owner_by_pid(host[1]));
					kill_list.push(p);
				}
			}
			if (!kill_list.includes(p)){
				board[newpos[0]][newpos[1]] = new lattice((curr_time+1), p.the_id, arrow);
				p.trace.push([(curr_time+1), newpos, arrow]);
			}
		}
		for (var a in kill_list){
			kill(a);
		}
	}

	this.kill()

	this.finder(what, in_this_list, ith_elem_of_each_elem){
		//finds the smallest index r such that ith_elem_of_each_elem of elem at index at r
		// is >= what and returns it
		if (in_this_list.length == 0) return 0;
		if (last elem is < what) return in_this_list.length;

		function finder_help(start_ind, end_ind){
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
}