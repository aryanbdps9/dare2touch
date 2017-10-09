function rendere(board,gnor,gnoc){
	// var arr = [[],[],[],[],[],[],[],[],[],[]];
	// arr[1] = [[1,2,3],[0,1,4],[0,2,3]];
	// arr[2] = [[0,2,3],[1,1,3],[1,1,2]];
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	for (var rr = 0; rr < gnor; rr++){
		for (var i = 0; i < gnoc; i++){
			if(arr[rr][i] == undefined){
				ctx.beginPath();
				ctx.rect(50*i,50*rr,50,50);
				ctx.fillStyle = "grey";
				ctx.fill();
				ctx.closePath();
			}
			else{
				if(arr[rr][i][0] == 1){
					ctx.beginPath();
					ctx.rect(50*i,50*rr, 50, 50);
					ctx.fillStyle = "green";
					ctx.fill();
					ctx.closePath();
				}
				else if(arr[rr][i][0] == 0){
					ctx.beginPath();
					ctx.rect(50*i,50*rr,50,50);
					ctx.fillStyle = "red";
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}
}