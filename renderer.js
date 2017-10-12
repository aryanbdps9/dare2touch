function renderer(board,gnor,gnoc,list_of_players){
	// var arr = [[],[],[],[],[],[],[],[],[],[]];
	// arr[1] = [[1,2,3],[0,1,4],[0,2,3]];
	// arr[2] = [[0,2,3],[1,1,3],[1,1,2]];
	var list_of_colors=["green", "blue", "red", "yellow"];
	console.log("renderer was called");
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	// var side = Math.min(window.innerWidth/200,window.innerHeight/100);
	// console.log("side:  ", side);
	var side = 5.7;
	for (var rr = 0; rr < gnor; rr++){
		for (var i = 0; i < gnoc; i++){
			if(board[rr][i] === undefined){
				ctx.beginPath();
				ctx.rect(side*i,side*rr,side,side);
				ctx.fillStyle = "grey";
				ctx.fill();
				ctx.closePath();
			}
			else{
				for (var j=list_of_players.length-1; j>=0; j--){
					if(board[rr][i].pid == list_of_players[j][0]){
						ctx.beginPath();
						ctx.rect(side*i,side*rr, side, side);
						ctx.fillStyle = list_of_colors[j];
						ctx.fill();
						ctx.closePath();
					}
				}
			}
		}
	}
}

// module.exports = renderer;