function Grid(roarg, colarg){
	this.cleard = false;
	this.grid_num_row = roarg;
	this.grid_num_col = colarg;
	this.pl_lst = undefined;
	this.grid = new Array(grid_num_row);
	if (!cleard){
		clearGrid();
	}
	this.get = function(row, col){
		if (isOutOfRange(row, col, grid_num_row, grid_num_col)){
			throw new RangeError("Row or Col val out of range.");
		}
		return grid[row][col];
	}
	this.set = function(val, row, col){
		if (isOutOfRange(row, col, grid_num_row, grid_num_col)){
			throw new RangeError("Row or Col val out of range.");
		}
		grid[row][col] = value;
		if (cleard){
			cleard = false;
		}
	}
	this.isOutOfRange = function(roa, cola){
		return (roa < 0) || (cola < 0) || (grid_num_col <= cola) || (grid_num_row <= roa);
	}
	this.create_empty_rows = function(){
		for (var i = grid.length - 1; i >= 0; i--) {
			grid[i] = new Array(colarg);
		}
	}
	this.clearGrid = function () {
		if (!cleard){
			each_col = new Array(grid_num_col);
			for (var i = 0; i < grid_num_col; i++){
				each_col[i] = -1;
			}
			for(var i = 0; i < grid_num_row; i++){
				grid[i] = each_col.slice(0);
			}
			cleard = true;
		}
	}

	this.iniPlayer(indxLst) = function(indxLst){
		//TODO: make it general,
		//Currently for 2 players only
		pl_lst = indxLst;
		if (!cleard){
			clearGrid();
		}
		var x0 = Math.floor(grid_num_col/4), x1 = Math.floor(grid_num_col*3/4);
		var y = Math.floor(grid_num_row / 2);
		set(pl_lst[0], x0, y);
		set(pl_lst[1], x1, y);
	}
	this.kill_player_with_indx(ind) = function(ind){
		// this fn does 2 jobs:
		// 1->removes all the gridpoints with val = ind
		// 2->removes entry from pl_lst
		if ((pl_lst.length > ind) && (ind > -1)){
			for (var i = grid_num_row - 1; i >= 0; i--) {
				for(var j = grid_num_col - 1; j >= 0; j--){
					if (grid[i][j] == ind){
						grid[i][j] = -1;
					}
				}
			}
			pl_lst.splice(ind, 1);
		}
	}
}

module.exports = Grid;