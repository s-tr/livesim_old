function GameContext(){
	var canvas=document.getElementById('canvas');
	var h=canvas.height;
	var w=canvas.width;
	var ctx=document.getElementById('canvas').getContext('2d');
	
	this.context=ctx;
	this.size=h;
	this.approachTime=1.2;
}

GameContext.prototype.initialise= function(type){
	if(type=="bandori"){
		this.position=__positionBandori;
		this._drawNote=__drawNoteBandori;
		this.drawLN=__drawLNBandori;
		this.reset=__prepareCanvasBandori;
		document.title="bandori player";
	}
	else/* if(type=="sif")*/{
		this.position=__positionSIF;
		this._drawNote=__drawNoteSIF;
		this.drawLN=__drawLNSIF;
		this.reset=__prepareCanvasSIF;
		document.title="sif player";
	}
	this.reset();
}
	
GameContext.prototype.drawNote=function (curTime,note){
	this._drawNote(
		this.position(
			note.lane,note.lane,
			1-(note.time-curTime)/this.approachTime,
			this.size),
		note.type);
}



