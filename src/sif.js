var circleSize=0.085;
var innerRadius=0.025;
var outerRadius=0.625;
var nLanes=9;

var colours={};
colours.red={
	border: "#d57575",
	inside: ["#ee2222","#ff7777","#880000","#ca1515"],
	//border (0,45,84)
	//inside (0,86,93), (0,53,100), (0,100,53), (0,90,79)
}

colours.blue = {
	border: "#66aacc",
	inside: ["#2080f0","#44ffff","#003388","#0088dd"],
	//border (200,50,80)
	//inside (212,87,94), (180,73,100), (218,100,53), (203,100,87)
}
colours.green={
	border: "#80c080",
	inside: ["#22ee22","#77ff77","#0d880d","#00bb00"],
	//border (120,33,75)
	//inside (120,86,93), (128,53,100), (120,0,53), (120,100,73)
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
	var colour=deco.colour;
	ctx.save();
	
	ctx.fillStyle=colour.border;
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*1.00,0,Math.PI*2,false);
	ctx.arc(xpos,ypos,radius*0.79,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle="#ffffff";
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*0.965,0,Math.PI*2,false);
	ctx.arc(xpos,ypos,radius*0.825,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	var grad=ctx.createLinearGradient(xpos-0.65*radius,ypos-0.65*radius,xpos+0.65*radius,ypos+0.65*radius);
	grad.addColorStop(0,colour.inside[0]);
	grad.addColorStop(0.43,colour.inside[1]);
	grad.addColorStop(0.57,colour.inside[2]);
	grad.addColorStop(1,colour.inside[3]);
	ctx.fillStyle=grad;
	ctx.beginPath();
	ctx.arc(xpos,ypos,radius*0.93,0,Math.PI*2,false);
	ctx.arc(xpos,ypos,radius*0.86,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();

	if(deco.sametime){
		__decoSameTime.call(this,posArr);
	}
	
	ctx.restore();
}

function __decoSameTime(posArr){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var radius=scale*circleSize*this.size;
	var ctx=this.context;
	
	var grad=ctx.createLinearGradient(xpos-0.5*radius,ypos,xpos+0.5*radius,ypos);
	grad.addColorStop(0.0,"#f8f8f8");
	grad.addColorStop(0.25,"#d3d3d3");
	grad.addColorStop(0.5,"#c8c8c8");
	grad.addColorStop(0.75,"#d3d3d3");
	grad.addColorStop(1.0,"#f8f8f8");
	ctx.fillStyle="#f8f8f8";
	ctx.fillRect(xpos-0.95*radius,ypos-0.2*radius,1.9*radius,0.4*radius);
	ctx.fillStyle=grad;
	ctx.fillRect(xpos-0.5*radius,ypos-0.1*radius,1.0*radius,0.2*radius);
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

function __drawSwipeSIF(posArr,deco,isLeft){
	var k=(deco.sametime|false);
	deco.sametime=false;
	__drawHitSIF.call(this,posArr,deco);
	deco.sametime=k;

	
	
	if(deco.sametime){
		__decoSameTime.call(this,posArr);
	}
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

function __drawLNConnectSIF(curTime,note1,note2,beginTime){
	var fromTime=note1.time;
	var fromPos=note1.lane;
	var toTime=note2.time;
	var toPos=note2.lane;
	
	if( (fromTime > curTime+this.approachTime) ||
	    (toTime   < curTime)){
		return;
	}
	
	if(fromTime < curTime){
		fromPos=fromPos+(toPos-fromPos)*(curTime-fromTime)/(toTime-fromTime);
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
	this.decoration.colour = (decorate||{}).colour || colours.blue;
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
