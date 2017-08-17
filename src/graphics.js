/**
 * graphics.js - universal graphics code
 * 
 * This file provides the GameContext class, through which all drawing
 * is to be done. 
 * 
 * 
 */

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
		this.__drawNote=__drawNoteBandori;
		this.reset=__prepareCanvasBandori;
		this.__drawLNConnect=__drawLNConnectBandori;
		document.title="bandori player";
	}
	else/* if(type=="sif")*/{
		this.position=__positionSIF;
		this._drawNote=__drawNoteSIF;
		this.reset=__prepareCanvasSIF;
		this.__drawLNConnect=(function(){});
		document.title="sif player";
	}
	this.reset();
}
	
GameContext.prototype.drawNote=function (curTime,note){
	this.__drawNote(
		this.position(
			note.lane,note.lane,
			1-(note.time-curTime)/this.approachTime,
			this.size),
		note.type);
}

GameContext.prototype.drawLN = function (curTime,ln){
	var visBegin=0;
	var visEnd=ln.notes.length-1;
	while(ln.notes[visBegin].time<curTime){
		visBegin++;
	}
	while(ln.notes[visEnd].time>curTime+this.approachTime){
		visEnd--;
	}
	
	for(var i=Math.max(0,visBegin-1);i<=Math.min(ln.notes.length-2,visEnd);i++){
		__drawLNConnectBandori.call(
			this,curTime,
			ln.notes[i].time,  ln.notes[i].lane,
			ln.notes[i+1].time,ln.notes[i+1].lane);
	}
	
	for(var i=visBegin;i<=visEnd;i++){
		this.drawNote(curTime,ln.notes[i]);
	}
}

