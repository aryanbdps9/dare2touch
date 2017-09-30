function gs_manager(nopa){
	var self = this;
	// this.storedpid_list = [];
	this.the_grid = new Grid(480,720);
	this.current_player = 0;  // number of current players
	this.cutoff = 4;
	this.kill_list = [];
	this.client_list = [];

	this.add_client(client) = function(client){
		// var playerin = false;
		var stored_player = client_list.length;
		the_grid.add_player(client.pid);
		var total_player = the_grid.ini_player_list_length();
		if(stored_player != total_player){
			// playerin = true;
			// storedpid_list.push(client.pid);
			current_player++;
			client_list.push(client);
		}
		// if(!playerin){
			
		// }
		game_start(current_player);
	}

	this.game_start(current_player) = function(current_player){
		if(current_player == nopa){
			the_grid.make_ready_for_update();
			setInterval(the_grid.update(), 100);
		}
	}

	this.movement(seq) = function(seq){
		actual_state = the_grid.get_actual_up_no();
		if(actaul_state - seq[0] <= cutoff){
			the_grid.add_sequence(seq);
		}
	}

	this.killed_player() = function(){
		setinterval(up_kill_list(), 100);
	}

	this.up_kill_list() = function(){
		game_kill_list = the_grid.killed_pid_list();

	}
}