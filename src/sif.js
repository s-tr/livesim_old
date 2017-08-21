var circleSize=0.085;
var innerRadius=0.025;
var outerRadius=0.625;
var nLanes=9;
var red={
	outColour: "#bb2222",
	inColour: "#770000",
}
var blue={
	outColour: "#77aaff",
	inColour: "#000077",
}
var green={
	outColour: "#55ff88",
	inColour: "#007700",
}

function __prepareCanvasSIF (){
	var c=this.context;
	var h=this.size;
	var r=circleSize*h;
	
	c.fillStyle='black';
	c.fillRect(0,0,1.6*h,h);
	
	for(var i=0;i<nLanes;i++){
		var xpos=h*(0.8+outerRadius*Math.cos(Math.PI/(nLanes-1)*i));
		var ypos=h*(0.225+outerRadius*Math.sin(Math.PI/(nLanes-1)*i));
		c.fillStyle='#aaaaaa';
		c.beginPath();
		c.ellipse(xpos,ypos,r,r,0,0,2*Math.PI);
		c.closePath();
		c.fill();
	}
}

function __positionSIF(start,end,progress,size,isAbsolute){
	function P(t){
		return t;
	}
	function S(t){
		return 0.05+0.95*t;
	}
	var angle=Math.PI/(nLanes-1)*(nLanes-1-end);
	var k=(innerRadius+(outerRadius-innerRadius)*P(progress));
	return [
		size*(0.8+k*Math.cos(angle)),
		size*(0.225+k*Math.sin(angle)),
		S(progress),
		Math.PI/2-end*Math.PI/8
	];
}

function __drawHitSIF(posArr,deco){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var radius=scale*circleSize*this.size;
	var ctx=this.context;
	ctx.save();
	
	ctx.fillStyle=deco.colour.outColour;
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*1.00,0,Math.PI*2,false);
	ctx.arc(xpos,ypos,radius*0.79,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle=deco.colour.inColour;
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*0.93,0,Math.PI*2,false);
	ctx.arc(xpos,ypos,radius*0.86,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();

	if(deco.sametime){
		ctx.fillStyle="#dddddd";
		ctx.beginPath();
		ctx.moveTo(xpos+0.95*radius,ypos+0.2*radius);
		ctx.lineTo(xpos-0.95*radius,ypos+0.2*radius);
		ctx.lineTo(xpos-0.95*radius,ypos-0.2*radius);
		ctx.lineTo(xpos+0.95*radius,ypos-0.2*radius);
		ctx.fill();
	}
	
	ctx.restore();
}

function __drawLNEndSIF(posArr,deco){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var radius=scale*circleSize*this.size;
	var ctx=this.context;
	ctx.save();
	
	ctx.fillStyle="#eeee22";
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*1.00,0,Math.PI*2,false);
	ctx.closePath();
	ctx.fill();
	
	ctx.restore();
}	

function __drawNoteSIF(posArr,type,deco){
	switch(type){
		case Note.HIT:
			__drawHitSIF.call(this,posArr,deco);
			break;
		case Note.LN_END:
			__drawLNEndSIF.call(this,posArr,deco);
			break;
		default:
			__drawHitSIF.call(this,posArr,deco);
			break;
	}
}

function __drawLNConnectSIF(curTime,note1,note2){
	var fromTime=note1.time;
	var fromPos=note1.lane;
	var toTime=note2.time;
	var toPos=note2.lane;
	
	if( (fromTime > curTime+this.approachTime) ||
	    (toTime   < curTime)){
		return;
	}
	
	if(fromTime < curTime){
		fromTime=curTime;
	}
	
	if(toTime > curTime+this.approachTime){
		toTime = curTime+this.approachTime;
	}
	
	var first=this.position(fromPos,fromPos,1-(fromTime-curTime)/this.approachTime,this.size,true);
	var second=this.position(toPos,toPos,1-(toTime-curTime)/this.approachTime,this.size,true);
	var ctx=this.context;
	
	ctx.save();
	
	ctx.fillStyle="#bbbbbb";
	if(fromTime==curTime){
		ctx.fillStyle="#dddd70";
	}
	ctx.beginPath();
	ctx.moveTo(first[0]+circleSize*this.size*first[2]*Math.cos(first[3]),first[1]+circleSize*this.size*first[2]*Math.sin(first[3]));
	ctx.lineTo(first[0]-circleSize*this.size*first[2]*Math.cos(first[3]),first[1]-circleSize*this.size*first[2]*Math.sin(first[3]));
	ctx.lineTo(second[0]-circleSize*this.size*second[2]*Math.cos(second[3]),second[1]-circleSize*this.size*second[2]*Math.sin(second[3]));
	ctx.lineTo(second[0]+circleSize*this.size*second[2]*Math.cos(second[3]),second[1]+circleSize*this.size*second[2]*Math.sin(second[3]));
	ctx.fill();
	
	if(fromTime==curTime){
		this.drawNote(curTime,new SIFNote(curTime,fromPos,Note.LN_BEGIN,note1.decoration));
	}
	
	ctx.restore();
}

function __initSIF(t){
	t.position=__positionSIF;
	t.__drawNote=__drawNoteSIF;
	t.reset=__prepareCanvasSIF;
	t.__drawLNConnect=__drawLNConnectSIF;
	document.title="sif player";
	t.__decorate=function(){};
}

__registerInit("sif",__initSIF);

function SIFNote(time,lane,type,decorate){
	Note.call(this,time,lane,lane,type);
	this.decoration.isStar = (decorate||{}).star || false;
	this.decoration.colour = (decorate||{}).colour || blue;
	this.decoration.sametime = (decorate||{}).sametime || false;
}

SIFNote.prototype=Object.create(Note.prototype);

function SIFLN(arr){
	if(arr.length<2){
		console.log("Malformed LN!");
		return 0;
	}
	this.notes=[];
	this.notes[0]=new SIFNote(arr[0][0],arr[0][1], arr[0][2] || Note.LN_BEGIN);
	for(var i=1;i<arr.length-1;i++){
		this.notes[i]=new SIFNote(arr[i][0],arr[i][1], arr[i][2] || Note.LN_MID);
	}
	this.notes[arr.length-1]=new SIFNote(arr[arr.length-1][0],arr[arr.length-1][1], arr[arr.length-1][2] || Note.LN_END);
	
	this.noteType="LN";
}

SIFLN.prototype=Object.create(LN.prototype);
