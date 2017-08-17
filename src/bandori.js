var bd={
	nLanes: 7,
	beginWidth: 0.14,
	endWidth: 1.54,
	trackTop: 0.06,
	spawnPos: 0.08,
	judgePos: 0.86,
	skewPerLane: function(){
		return (bd.endWidth-bd.beginWidth)/bd.nLanes/(bd.judgePos-bd.trackTop);
	},
	spawnWidth: function(){
		return bd.beginWidth+(bd.spawnPos-bd.trackTop)/(bd.judgePos-bd.trackTop)*(bd.endWidth-bd.beginWidth);
	},
	laneWidth: function(){
		return bd.endWidth/bd.nLanes;
	},
}

function __prepareCanvasBandori (){
	var ctx=this.context;
	var h=this.size;
	var w=this.size*1.6;
	
	ctx.transform(1,0,0,1,0,0);
	
	ctx.fillStyle='black';

	ctx.fillRect(0,0,w,h);

	ctx.fillStyle='#a0a0cc';
	ctx.beginPath();
	ctx.moveTo((0.8-bd.beginWidth/2)*h,bd.trackTop*h);
	ctx.lineTo((0.8-bd.endWidth/2)*h,bd.judgePos*h);
	ctx.lineTo((0.8-bd.endWidth/2-0.035)*h,bd.judgePos*h);
	ctx.lineTo((0.8-bd.beginWidth/2-0.006)*h,bd.trackTop*h);
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo((0.8+bd.beginWidth/2)*h,bd.trackTop*h);
	ctx.lineTo((0.8+bd.endWidth/2)*h,bd.judgePos*h);
	ctx.lineTo((0.8+bd.endWidth/2+0.035)*h,bd.judgePos*h);
	ctx.lineTo((0.8+bd.beginWidth/2+0.006)*h,bd.trackTop*h);
	ctx.fill();

	ctx.lineWidth=2;
	ctx.strokeStyle='#dddddd';
	
	for(n=1;n<=bd.nLanes-1;n++){
		ctx.beginPath();
		ctx.moveTo(((0.8-bd.beginWidth/2)+n*bd.beginWidth/bd.nLanes)*h,bd.trackTop*h);
		ctx.lineTo(((0.8-bd.endWidth/2)+n*bd.laneWidth())*h,bd.judgePos*h);
		ctx.stroke();
	}

	ctx.strokeStyle='#bbbbcc';
	ctx.beginPath();
	ctx.moveTo(0*h,bd.judgePos*h);
	ctx.lineTo(1.6*h,bd.judgePos*h);
	ctx.lineWidth=3;
	ctx.stroke();
}

function __positionBandori(start,end,progress,size,isAbsolute){
	/**
	 * This function describes the acceleration/deceleration of the note as it
	 * approaches the judgement position.
	 * 
	 */
	function P(t){
		return 0.6*t*t+0.4*t*t*t;
	}
	isAbsolute = isAbsolute || false;
	if(isAbsolute){
		return [
			size*(
				(1.6-bd.spawnWidth())/2+(bd.spawnWidth()/bd.nLanes)*(end+0.5)+
				P(progress)*((bd.endWidth-bd.spawnWidth())/bd.nLanes*(end+0.5)+(bd.spawnWidth()-bd.endWidth)/2)),
			(bd.spawnPos+(bd.judgePos-bd.spawnPos)*P(progress))*size,
			(bd.spawnWidth()+(bd.endWidth-bd.spawnWidth())*P(progress))/bd.endWidth, 
			0,
			0
		];
	}
	else {
		var skewCorrection=bd.laneWidth()-bd.skewPerLane()*bd.judgePos;
		return [
			0.8*size+skewCorrection*size*(end-(bd.nLanes-1)/2.0),
			(bd.spawnPos+(bd.judgePos-bd.spawnPos)*P(progress))*size,
			(bd.spawnWidth()+(bd.endWidth-bd.spawnWidth())*P(progress))/bd.endWidth,
			0,
			bd.skewPerLane()*(end-(bd.nLanes-1)/2.0)
		];
	}
}

function __drawHitBandori(posArr){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var skew=posArr[4];
	var xdim=scale*bd.laneWidth()*this.size/2;
	var ydim=(0.4+0.6*scale)*0.45*xdim;
	var c=this.context;
	var grad=c.createLinearGradient(xpos,ypos-ydim*0.8,xpos,ypos+ydim*0.8);
	grad.addColorStop(0,'#b57edc');
	grad.addColorStop(0.3,'#0000bb');
	grad.addColorStop(1,'#33e888');
	
	c.save();
	c.transform(1,0,skew,1,0,0);
	
	c.fillStyle='#ffffff';
	c.beginPath();
	c.ellipse(xpos,ypos,xdim,ydim,rotate,0,2*Math.PI);
	c.fill();
	c.fillStyle='#000000';
	c.beginPath();
	c.ellipse(xpos,ypos,xdim*0.9,ydim*0.9,rotate,0,2*Math.PI);
	c.fill();
	c.fillStyle=grad;
	c.beginPath();
	c.ellipse(xpos,ypos,xdim*0.8,ydim*0.8,rotate,0,2*Math.PI);
	c.fill();
	c.fillStyle='#ffffff';
	c.beginPath();
	c.ellipse(xpos,ypos,xdim*0.7,ydim*0.7,rotate,0,2*Math.PI);
	c.fill();

	c.restore();
}

function __drawLNEndBandori(posArr){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var skew=posArr[4];
	var xdim=scale*bd.laneWidth()*this.size/2;
	var ydim=(0.4+0.6*scale)*0.45*xdim;
	var c=this.context;
	var grad=c.createLinearGradient(xpos,ypos-ydim*0.8,xpos,ypos+ydim*0.8);
	grad.addColorStop(0,'#00ff66');
	grad.addColorStop(0.7,'#00dd00');
	grad.addColorStop(1,'#dddd00');
	
	c.save();
	c.transform(1,0,skew,1,0,0);
	
	c.fillStyle='#ffffff';
	c.beginPath();
	c.ellipse(xpos,ypos,xdim,ydim,rotate,0,2*Math.PI);
	c.fill();
	c.fillStyle='#000000';
	c.beginPath();
	c.ellipse(xpos,ypos,xdim*0.9,ydim*0.9,rotate,0,2*Math.PI);
	c.fill();
	c.fillStyle=grad;
	c.beginPath();
	c.ellipse(xpos,ypos,xdim*0.8,ydim*0.8,rotate,0,2*Math.PI);
	c.fill();
	c.fillStyle='#ffffff';
	c.beginPath();
	c.ellipse(xpos,ypos,xdim*0.7,ydim*0.7,rotate,0,2*Math.PI);
	c.fill();

	c.restore();
}

function __drawSwipeBandori(posArr){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var skew=posArr[4];
	var xdim=scale*bd.laneWidth()*this.size/2;
	var ydim=(0.4+0.6*scale)*0.45*xdim;
	var c=this.context;
	
	
	c.save();
	c.transform(1,0,skew,1,0,0);
	
	c.fillStyle="#cc5555";
	c.beginPath();
	c.moveTo(xpos+xdim,ypos);
	c.lineTo(xpos,ypos-ydim);
	c.lineTo(xpos-xdim,ypos);
	c.lineTo(xpos,ypos+ydim);
	c.lineTo(xpos+xdim,ypos);
	c.moveTo(xpos,ypos-0.85*ydim);
	c.lineTo(xpos+0.85*xdim,ypos);
	c.lineTo(xpos,ypos+0.85*ydim);
	c.lineTo(xpos-0.85*xdim,ypos);
	c.lineTo(xpos,ypos-0.85*ydim);
	c.fill();
	
	c.beginPath();
	c.moveTo(xpos,ypos-0.6*ydim);
	c.lineTo(xpos+0.6*xdim,ypos);
	c.lineTo(xpos,ypos+0.6*ydim);
	c.lineTo(xpos-0.6*xdim,ypos);
	c.lineTo(xpos,ypos-0.6*ydim);
	c.fill();
	
	c.strokeStyle="#bb4444"
	c.lineWidth=2.5;
	
	c.beginPath();
	c.moveTo(xpos-0.75*xdim,ypos-0.55*ydim);
	c.lineTo(xpos+0.0*xdim,ypos-1.3*ydim);
	c.lineTo(xpos+0.75*xdim,ypos-0.55*ydim);
	c.stroke();
	
	c.beginPath();
	c.moveTo(xpos-0.73*xdim,ypos-0.85*ydim);
	c.lineTo(xpos+0.0*xdim,ypos-1.6*ydim);
	c.lineTo(xpos+0.73*xdim,ypos-0.85*ydim);
	c.stroke();
	
	c.restore();
}

function __drawLNMidBandori(posArr){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var skew=posArr[4];
	var xdim=scale*1.1*bd.laneWidth()*this.size/2;
	var ydim=(0.7+0.3*scale)*scale*0.13*xdim;
	var c=this.context;
	
	c.save();
	c.transform(1,0,skew,1,0,0);
	
	c.fillStyle='#22cc22';
	c.fillRect(xpos-xdim+ydim,ypos-ydim,2*(xdim-ydim),2*ydim);
	c.beginPath();
	c.moveTo(xpos-xdim+2*ydim,ypos);
	c.arc(xpos-xdim+ydim,ypos,ydim,0,2*Math.PI);
	c.fill();
	c.beginPath();
	c.moveTo(xpos+xdim,ypos);
	c.arc(xpos+xdim-ydim,ypos,ydim,0,2*Math.PI);
	c.fill();
	
	xdim=xdim*0.8;
	ydim=ydim*0.7;
	c.fillStyle='#006000';
	c.fillRect(xpos-xdim+ydim,ypos-ydim,2*(xdim-ydim),2*ydim);
	c.beginPath();
	c.moveTo(xpos-xdim+2*ydim,ypos);
	c.arc(xpos-xdim+ydim,ypos,ydim,0,2*Math.PI);
	c.fill();
	c.beginPath();
	c.moveTo(xpos+xdim,ypos);
	c.arc(xpos+xdim-ydim,ypos,ydim,0,2*Math.PI);
	c.fill();

	c.restore();
}

function __drawNoteBandori(posArr,type){
	switch(type){
		case Note.ETC:
		case Note.HIT:
			__drawHitBandori.call(this,posArr);
			break;
		case Note.LN_BEGIN:
		case Note.LN_END:
			__drawLNEndBandori.call(this,posArr);
			break;
		case Note.LN_MID:
			__drawLNMidBandori.call(this,posArr);
			break;
		case Note.SWIPE:
			__drawSwipeBandori.call(this,posArr);
			break;
	}
}

/**
 * Draws a LN connector between the two specified positions.
 * fromTime must be less than or equal to toTime.
 * 
 * If the whole LN connector is invisible, this method does nothing.
 * 
 * If the LN connector's actual end is invisible, the end is instead
 * drawn at the furthest possible position, with the lane being the end's lane.
 * 
 * If the LN connector's actual start is invisible, the start is instead
 * drawn at a position interpolated between the two times, and a dummy
 * note is drawn there.
 */
function __drawLNConnectBandori(curTime,fromTime,fromPos,toTime,toPos){
	
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
	var thickness=0.85*bd.laneWidth()/2;
	var ctx=this.context;
	
	ctx.save();
	
	ctx.fillStyle="#008000";
	ctx.beginPath();
	ctx.moveTo(first[0]-thickness*this.size*first[2],first[1]);
	ctx.lineTo(first[0]+thickness*this.size*first[2],first[1]);
	ctx.lineTo(second[0]+thickness*this.size*second[2],second[1]);
	ctx.lineTo(second[0]-thickness*this.size*second[2],second[1]);
	ctx.fill();
	
	if(fromTime==curTime){
		this.drawNote(curTime,new Note(curTime,fromPos,Note.LN_BEGIN));
	}
	
	ctx.restore();
}

function __initBandori(t){
	t.position=__positionBandori;
	t.__drawNote=__drawNoteBandori;
	t.reset=__prepareCanvasBandori;
	t.__drawLNConnect=__drawLNConnectBandori;
	document.title="bandori player";
}

__registerInit("bandori",__initBandori);


