function __prepareCanvasBandori (){
	var ctx=this.context;
	var h=this.size;
	var w=this.size*1.6;
	
	ctx.transform(1,0,0,1,0,0);
	
	ctx.fillStyle='black';

	ctx.fillRect(0,0,w,h);

	ctx.fillStyle='#a0a0cc';
	ctx.beginPath();
	ctx.moveTo(0.73*h,0.06*h);
	ctx.lineTo(0.03*h,0.86*h);
	ctx.lineTo(-0.005*h,0.86*h);
	ctx.lineTo(0.724*h,0.06*h);
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(0.87*h,0.06*h);
	ctx.lineTo(1.57*h,0.86*h);
	ctx.lineTo(1.605*h,0.86*h);
	ctx.lineTo(0.876*h,0.06*h);
	ctx.fill();

	ctx.lineWidth=2;
	ctx.strokeStyle='#dddddd';
	
	for(n=1;n<=6;n++){

		ctx.beginPath();
		ctx.moveTo((0.73+n*0.02)*h,0.06*h);
		ctx.lineTo((0.03+n*0.22)*h,0.86*h);
		ctx.stroke();
	}

	ctx.strokeStyle='#bbbbcc';
	ctx.beginPath();
	ctx.moveTo(0*h,0.86*h);
	ctx.lineTo(1.6*h,0.86*h);
	ctx.lineWidth=3;
	ctx.stroke();
}

/**
 * Position functions
 * 
 * Position functions take five arguments:
 * 1. The start lane (0..N-1 for N discrete lanes, real 0..1 otherwise)
 * 2. The end lane (0..N-1 for N discrete lanes, real 0..1 otherwise)
 * 3. The progress of the note (0..1+a bit)
 * 4. The size of the playfield
 * 5. Whether the arguments are to be returned in absolute coordinates
 *    or with skew.
 * 
 * Position returns a 5-element array as follows:
 * 
 * [0]: X position of note
 * [1]: Y position of note
 * [2]: Scale factor applied to note
 * [3]: Rotation amount of note (starting from 0, going counterclockwise from 
 *      the positive X-axis)
 * [4]: Skew factor applied to note
 */

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
			size/100.0*(71.25+2.5*(end+0.5)+P(progress)*(19.5*(end+0.5)-68.25)),
			(0.08+0.78*P(progress))*size,
			(17.5+119*P(progress))/136.5, 
			0,
			0
		];
	}
	else {
		return [
			0.8*size+0.005*size*(end-3),
			(0.08+0.78*P(progress))*size,
			(17.5+119*P(progress))/136.5,
			0,
			0.25*(end-3)
		];
	}
}

function __drawHitBandori(posArr){
	var xpos=posArr[0];
	var ypos=posArr[1];
	var scale=posArr[2];
	var rotate=posArr[3];
	var skew=posArr[4];
	var xdim=scale*0.21*this.size/2;
	var ydim=(0.4+0.6*scale)*scale*0.10*this.size/2;
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
	var xdim=scale*0.21*this.size/2;
	var ydim=(0.4+0.6*scale)*scale*0.10*this.size/2;
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
	var xdim=scale*0.21*this.size/2;
	var ydim=(0.55+0.45*scale)*scale*0.11*this.size/2;
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
	var xdim=scale*0.235*this.size/2;
	var ydim=(0.7+0.3*scale)*scale*0.03*this.size/2;
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
	
	var ctx=this.context;
	
	ctx.save();
	
	ctx.fillStyle="#008000";
	ctx.beginPath();
	ctx.moveTo(first[0]-0.095*this.size*first[2],first[1]);
	ctx.lineTo(first[0]+0.095*this.size*first[2],first[1]);
	ctx.lineTo(second[0]+0.095*this.size*second[2],second[1]);
	ctx.lineTo(second[0]-0.095*this.size*second[2],second[1]);
	ctx.fill();
	
	if(fromTime==curTime){
		this.drawNote(curTime,new Note(curTime,fromPos,Note.LN_BEGIN));
	}
	
	ctx.restore();
}


