function renderer(board,gnor,gnoc,list_of_players,starting){
	// var arr = [[],[],[],[],[],[],[],[],[],[]];
	// arr[1] = [[1,2,3],[0,1,4],[0,2,3]];
	// arr[2] = [[0,2,3],[1,1,3],[1,1,2]];
	var startTime = new Date();
	var list_of_colors=["green", "blue", "red", "yellow"];
	console.log("renderer was called");
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	//canvas.width = window.innerWidth;
	//canvas.height = window.innerHeight;
	// console.log("ch = " , window.innerHeight);
	// console.log("cah = ", canvas.height);
	// console.log("cw = ", window.innerWidth);
	// console.log("caw = ", canvas.width);
	// var side = Math.min(window.innerWidth/200,window.innerHeight/100);
	// console.log("side:  ", side);
	var side = 4.1;
	for (var rr = 0; rr < gnor; rr++){
		for (var i = 0; i < gnoc; i++){
			if(board[rr][i] === undefined){
				ctx.beginPath();
				ctx.rect(side*i,side*rr,side,side);
				ctx.fillStyle = "black";
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
	for (var j=list_of_players.length-1; j>=0; j--){
		ctx.beginPath();
		ctx.rect(gnoc*side+side, 10*side+side*3*j, side*2, side*2);
		ctx.fillStyle = list_of_colors[j];
		ctx.fill();
		ctx.closePath();
		ctx.font = "20px Arial";
		ctx.fillStyle = "yellow";
		ctx.fillText(list_of_players[j][0], gnoc*side+side*4, 10*side+side*(3*j+2));
	}
		

	if(starting == 3){
		ctx.font = "30px Arial";
		ctx.fillStyle = "yellow";
		ctx.fillText("Starting in 3 sec.",(gnoc*side)/3, (gnor*side)/3);
	}
	else if(starting == 2){
		ctx.font = "30px Arial";
		ctx.fillStyle = "yellow";
		ctx.fillText("Starting in 2 sec.",(gnoc*side)/3, (gnor*side)/3);
	}
	else if(starting == 1){
		ctx.font = "30px Arial";
		ctx.fillStyle = "yellow";
		ctx.fillText("Starting in 1 sec.",(gnoc*side)/3, (gnor*side)/3);
	}
	var endTime = new Date();
	var timeDiff = endTime - startTime;
	console.log("time taken is", timeDiff);
}

// module.exports = renderer;