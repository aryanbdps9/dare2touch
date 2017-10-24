function AI(board,currentpos,lastpos,gnor,gnoc){
	var self = this;
	var current_diff = -(gnor*gnoc);
	var max_diff = -(gnor*gnoc);
	var direction = [];
	var nextpos = [];
	var actual_next_pos = [];

	this.find_diff = function(currentposition,nextposition,lastposition){
		var ai_points = 0;
		var player_points = 0;
		var diff_points = 0;
		var player_next_pos = [];
		var pos = [];
		// console.log("find_diff called")
		for(var rr=0;rr<gnor;rr++){
			for(var i=0;i<gnoc;i++){
				// pos = [rr,i];
				for(var j=0;j<3;j++){
					if(j==0){
						if((currentposition[1][0] != 0 || (currentposition[1][1] - lastposition[1][1] != -1)) &&
							(currentposition[1][0] != gnor-1 || (currentposition[1][1] - lastposition[1][1] != 1)) &&
							(currentposition[1][1] != 0 || (currentposition[1][0] - lastposition[1][0] != 1)) &&
							(currentposition[1][1] != gnoc-1 || (currentposition[1][0] -lastposition[1][0] != -1))){
							if(currentposition[1][0] - lastposition[1][0] != 0 && board[currentposition[1][0]][currentposition[1][1] - currentposition[1][0] + lastposition[1][0]] === undefined){
								player_next_pos = [currentposition[1][0],currentposition[1][1] - currentposition[1][0] + lastposition[1][0]];
							}
							else if(board[currentposition[1][0] - currentposition[1][1] + lastposition[1][1]][currentposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0] - currentposition[1][1] + lastposition[1][1],currentposition[1][1]];
							}
						}
					}
					else if(j==1){
						if((currentposition[1][0] != 0 || (currentposition[1][0] - lastposition[1][0] != -1)) &&
							(currentposition[1][0] != gnor-1 || (currentposition[1][0] - lastposition[1][0] != 1)) &&
							(currentposition[1][1] != 0 || (currentposition[1][1] - lastposition[1][1] != -1)) &&
							(currentposition[1][1] != gnoc-1 || (currentposition[1][1] -lastposition[1][1] != 1))){
							if(currentposition[1][0] - lastposition[1][0] != 0 && board[currentposition[1][0] + currentposition[1][0] - lastposition[1][0]][currentposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0] + currentposition[1][0] - lastposition[1][0],currentposition[1][1]];
							}
							else if(board[currentposition[1][0]][currentposition[1][1] + currentposition[1][1] - lastposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0],currentposition[1][1] + currentposition[1][1] - lastposition[1][1]];
							}
						}
					}
					else if(j==2){
						if((currentposition[1][0] != 0 || (currentposition[1][1] - lastposition[1][1] != 1)) &&
							(currentposition[1][0] != gnor-1 || (currentposition[1][1] - lastposition[1][1] != -1)) &&
							(currentposition[1][1] != 0 || (currentposition[1][0] - lastposition[1][0] != -1)) &&
							(currentposition[1][1] != gnoc-1 || (currentposition[1][0] -lastposition[1][0] != 1))){
							if(currentposition[1][0] - lastposition[1][0] != 0 && board[currentposition[1][0]][currentposition[1][1] + currentposition[1][0] - lastposition[1][0]] === undefined){
								player_next_pos = [currentposition[1][0],currentposition[1][1] + currentposition[1][0] - lastposition[1][0]];
							}
							else if(board[currentposition[1][0] + currentposition[1][1] - lastposition[1][1]][currentposition[1][1]] === undefined){
								player_next_pos = [currentposition[1][0] + currentposition[1][1] - lastposition[1][1],currentposition[1][1]];
							}
						}
					}

					// console.log("before checing undefined property")
					if(board[rr][i] === undefined){
						if(Math.abs(nextposition[0] - rr) + Math.abs(nextposition[1] - i) > Math.abs(player_next_pos[0] - rr) + Math.abs(player_next_pos[1] - i)){
							ai_points++;
						}
						else if(Math.abs(nextposition[0] - rr) + Math.abs(nextposition[1] - i) < Math.abs(player_next_pos[0] - rr) + Math.abs(player_next_pos[1] - i)){
							player_points++;
						}
					}
				}
			}
		}
		diff_points = ai_points - player_points;
		return diff_points;
	}

	this.ai = function(currentpos,lastpos){
		console.log(currentpos)
		// console.log("ai called")
		for(var i=0;i<3;i++){
			if(i==0){
				if((currentpos[0][0] != 0 || (currentpos[0][1] - lastpos[0][1] != -1)) &&
					(currentpos[0][0] != gnor-1 || (currentpos[0][1] - lastpos[0][1] != 1)) &&
					(currentpos[0][1] != 0 || (currentpos[0][0] - lastpos[0][0] != 1)) &&
					(currentpos[0][1] != gnoc-1 || (currentpos[0][0] -lastpos[0][0] != -1))){
					if(currentpos[0][0] - lastpos[0][0] != 0){
						nextpos = [currentpos[0][0],currentpos[0][1] - currentpos[0][0] + lastpos[0][0]];
						if(board[nextpos[0]][nextpos[1]] === undefined){
							current_diff = self.find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
					else{
						nextpos = [currentpos[0][0] - currentpos[0][1] + lastpos[0][1],currentpos[0][1]];
						if(board[nextpos[0]][nextpos[1]] === undefined){
							current_diff = self.find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
				}
			}
			else if(i==1){
				if((currentpos[0][0] != 0 || (currentpos[0][0] - lastpos[0][0] != -1)) &&
					(currentpos[0][0] != gnor-1 || (currentpos[0][0] - lastpos[0][0] != 1)) &&
					(currentpos[0][1] != 0 || (currentpos[0][1] - lastpos[0][1] != -1)) &&
					(currentpos[0][1] != gnoc-1 || (currentpos[0][1] -lastpos[0][1] != 1))){
					if(currentpos[0][0] - lastpos[0][0] != 0){
						nextpos = [currentpos[0][0] + currentpos[0][0] - lastpos[0][0],currentpos[0][1]];
						if(board[nextpos[0]][nextpos[1]] === undefined){
							current_diff = self.find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
					else{
						nextpos = [currentpos[0][0],currentpos[0][1] + currentpos[0][1] - lastpos[0][1]];
						if(board[nextpos[0]][nextpos[1]] === undefined){
							current_diff = self.find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
				}
			}
			else if(i==2){
				if((currentpos[0][0] != 0 || (currentpos[0][1] - lastpos[0][1] != 1)) &&
					(currentpos[0][0] != gnor-1 || (currentpos[0][1] - lastpos[0][1] != -1)) &&
					(currentpos[0][1] != 0 || (currentpos[0][0] - lastpos[0][0] != -1)) &&
					(currentpos[0][1] != gnoc-1 || (currentpos[0][0] -lastpos[0][0] != 1))){
					if(currentpos[0][0] - lastpos[0][0] != 0){
						nextpos = [currentpos[0][0],currentpos[0][1] + currentpos[0][0] - lastpos[0][0]];
						if(board[nextpos[0]][nextpos[1]] === undefined){
							current_diff = self.find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
					else{
						nextpos = [currentpos[0][0] + currentpos[0][1] - lastpos[0][1],currentpos[0][1]];
						if(board[nextpos[0]][nextpos[1]] === undefined){
							current_diff = self.find_diff(currentpos,nextpos,lastpos);
							console.log(current_diff)
							console.log(nextpos)
						}
					}
				}
			}
			// console.log("before find_diff")
			// console.log("after find_diff")
			if(current_diff > max_diff){
				max_diff = current_diff;
				actual_next_pos = nextpos;
			}
			// console.log("for loop ended ",i," time")
		}

		direction = [actual_next_pos[0] - currentpos[0][0],actual_next_pos[1] - currentpos[0][1]];
		// console.log("everything was ohk")
		return direction;
	}
}
module.exports = AI;