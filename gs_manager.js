var Grid = require('./grid')

Array.prototype.diff = function(a){
	return this.filter(function(i){
		return a.indexOf(i) < 0;
	});
};

function gs_manager(nopa){
	var self = this;
	// this.storedpid_list = [];
	var the_grid = new Grid(480,720);
	var current_player = 0;  // number of current players
	var cutoff = 4;
	var kill_list = [];
	var client_list = [];
	var recently_killed = [];
	var alive_list = [];

	this.add_client= function(client){
		// var playerin = false;
		var stored_player = client_list.length;
		the_grid.add_player(client);
		var total_player = the_grid.ini_player_list_length();
		if(stored_player != total_player){
			// playerin = true;
			// storedpid_list.push(client.pid);
			current_player++;
			client_list.push(client);
			console.log("Player with player id" + client + "added.")
		}
		// if(!playerin){
			
		// }
		if(current_player == nopa){
			self.game_start();
		}
	}

	this.game_start = function(){
		the_grid.make_ready_for_update();
		console.log("Ready to start the game.");
		alive_list = client_list;
		setInterval(self.master(), 100);
	}

	this.handle_input = function(pid,input,up_no){
		actual_state = the_grid.get_actual_up_no();
		if(actaul_state - up_no <= cutoff){
			if(input == "w"){
				the_grid.add_sequence([up_no,pid,[0,1]]);
				console.log(pid + "move up");
				//alive_list.forEach(function(p){
				//	p.send(pid + "move up");
				//});
			}
			else if(input == "s"){
				the_grid.add_sequence([up_no,pid,[0,-1]]);
				console.log(pid + "move down");
				//alive_list.forEach(function(p){
				//	p.send(pid + "move down");
				//});
			}
			else if(input == "a"){
				the_grid.add_sequence([up_no,pid,[1,0]]);
				console.log(pid + "move left");
				//alive_list.forEach(function(p){
				//	p.send(pid + "move left");
				//});
			}
			else if(input == "d"){
				the_grid.add_sequence([up_no,pid,[-1,0]]);
				console.log(pid + "move right");
				//alive_list.forEach(function(p){
				//	p.send(pid + "move right");
				//});
			}
			else{
				console.log("Wrong Input");
			}
		}
	}

	//this.killed_player = function(){
	//	setinterval(up_kill_list(), 100);
	//}

	this.up_kill_list = function(){
		game_kill_list = the_grid.get_killed_list();
		recently_killed = game_kill_list.diff(kill_list);
		recently_killed.forEach(function(p){
			console.log(p.id + "killed");
			//alive_list.forEach(function(q){
			//	q.send(p.id + "killed");
			//});
		});
		kill_list = game_kill_list;
	}

	this.master = function(){
		the_grid.update();
		self.up_kill_list();
	}
}

module.exports = gs_manager;