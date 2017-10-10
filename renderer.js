function renderer(board,gnor,gnoc){
	// var arr = [[],[],[],[],[],[],[],[],[],[]];
	// arr[1] = [[1,2,3],[0,1,4],[0,2,3]];
	// arr[2] = [[0,2,3],[1,1,3],[1,1,2]];

	console.log("renderer was called");
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var side = 10;
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
				if(board[rr][i].pid == 1){
					ctx.beginPath();
					ctx.rect(side*i,side*rr, side, side);
					ctx.fillStyle = "green";
					ctx.fill();
					ctx.closePath();
				}
				else if(board[rr][i].pid == 0){
					ctx.beginPath();
					ctx.rect(side*i,side*rr,side,side);
					ctx.fillStyle = "red";
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}
}

// module.exports = renderer;