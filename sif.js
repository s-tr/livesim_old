function __prepareCanvasSIF (){
	var c=this.context;
	var h=this.size;
	var r=0.085*h;
	
	c.fillStyle='black';
	c.fillRect(0,0,1.6*h,h);
	
	for(var i=0;i<9;i++){
		var xpos=h*(0.8+0.625*Math.cos(Math.PI/8*i));
		var ypos=h*(0.225+0.625*Math.sin(Math.PI/8*i));
		c.fillStyle='#aaaaaa';
		c.beginPath();
		c.ellipse(xpos,ypos,r,r,0,0,2*Math.PI);
		c.closePath();
		c.fill();
	}                                         
}

function __positionSIF(start,end,progress,size,isAbsolute){
	function P(t){
		if(t<0.85){
			return t+0.036*t;
		} else {
			return t+0.204*(1-t);
		}
	}
	function S(t){
		return 0.4+0.6*t;
	}
	var angle=Math.PI/8*(8-end);
	var k=(0.125+0.5*P(progress));
	return [
		size*(0.8+k*Math.cos(angle)),
		size*(0.225+k*Math.sin(angle)),
		S(progress),
		-Math.PI/2+end*Math.PI/8
	];
}

function __drawNoteSIF(posArr,type){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var radius=scale*0.085*this.size;
	var ctx=this.context;
	ctx.fillStyle="#bb2222";
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*1.00,0,Math.PI*2,false);
	ctx.arc(xpos,ypos,radius*0.88,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle="#770000";
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*0.96,0,Math.PI*2,false);
	ctx.arc(xpos,ypos,radius*0.92,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}

function __drawLNSIF(){
	
}

