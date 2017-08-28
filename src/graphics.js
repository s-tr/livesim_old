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
	this.approachTime=100;
}

/**
 * A GameContext is first prepared for drawing with the initialise()
 * function, which takes a type parameter. It is meant to be extensible
 * with different modules implementing game playfield types.
 * 
 * Each module has to provide an initialisation function through 
 * __registerInit(). It will initialise the values of:
 * 
 *   * position, a function for calculating the position of a note at
 *     a particular offset and lane,
 *   * __drawNote, a function for drawing a note on the screen,
 *   * reset, a function for clearing the screen and drawing an empty
 *     playfield,
 *   * __drawLNConnect, a function for drawing the connectors of a LN
 *     given the starting and ending positions/offsets,
 *   * __decorate, a function for decorating a note;
 * 
 * 
 * Position functions
 * 
 * position() takes five arguments:
 * 1. The start lane (0..N-1 for N discrete lanes, real 0..1 otherwise)
 * 2. The end lane (0..N-1 for N discrete lanes, real 0..1 otherwise)
 * 3. The progress of the note (0..1)
 * 4. The size of the playfield
 * 5. Whether the arguments are to be returned in absolute coordinates
 *    or relative to a skew factor.
 * 
 * Position returns a 5-element array as follows:
 * 
 * [0]: X position of note
 * [1]: Y position of note
 * [2]: Scale factor applied to note
 * [3]: Rotation amount of note (starting from 0, going counterclockwise from 
 *      the positive X-axis)
 * [4]: Skew factor applied to note
 * 
 * 
 * Raw note drawing functions
 * 
 * __drawNote() takes three values:
 * 1. An array in the form returned by position()
 * 2. The type of note (see structures.js)
 * 3. The decoration associated with the note
 * 
 * __drawLNConnect() takes three values:
 * 1. The current time
 * 2. The note at the beginning of the connector
 * 3. The note at the end of the connector
 * 4. The time at the beginning of the LN.
 *
 * These functions do not return a value.
 * 
 * 
 * Playfield initialisation function
 * 
 * reset() takes no arguments and returns no values.
 */
GameContext.prototype.initialise= function(type){
	var f=__initTable[type];
	if((typeof(f))==undefined){
		alert("Invalid game type");
		return;
	}
	f(this);
	this.reset();
}
	
GameContext.prototype.drawNote=function (curTime,note){
	this.__drawNote(
		this.position(
			note.lane,note.lane,
			1-(note.time-curTime)/this.approachTime,
			this.size,false),
		note.type,note.decoration);
}

GameContext.prototype.drawLN = function (curTime,ln){
	var beginTime=ln.notes[0].time;
	var visBegin=0;
	var visEnd=ln.notes.length-1;
	while(ln.notes[visBegin].time<curTime){
		visBegin++;
	}
	while(ln.notes[visEnd].time>curTime+this.approachTime){
		visEnd--;
	}
	
	for(var i=Math.max(0,visBegin-1);i<=Math.min(ln.notes.length-2,visEnd);i++){
		/*this.__drawLNConnect(
			curTime,
			ln.notes[i].time,  ln.notes[i].lane,
			ln.notes[i+1].time,ln.notes[i+1].lane);*/
		this.__drawLNConnect(
			curTime,
			ln.notes[i], ln.notes[i+1],
			beginTime);
	}
	
	for(var i=visBegin;i<=visEnd;i++){
		this.drawNote(curTime,ln.notes[i]);
	}
}

var __initTable={};

function __registerInit(name,f){
	__initTable[name]=f;
}

var frameCount=0;
var fps=240;
var lastTime=0;
var fpsInterval=1;
var delayStart=2;
function _draw(ctx,notes,start){
	var rawTime=(+(new Date().getTime())-start)/1000.0;
	var curTime=timing.trackPos(rawTime-delayStart);
	ctx.reset();
	for(var i=0;i<notes.length;i++){
		if(notes[i].isVisible(curTime,ctx.approachTime)){
			if(notes[i].noteType=="LN"){
				ctx.drawLN(curTime,notes[i]);
			} else {
				ctx.drawNote(curTime,notes[i]);
			}
		}
	}
	frameCount++;
	if(frameCount%(fpsInterval*fps)==0){
		var fpsAll=frameCount/rawTime;
		var fpsLast=fps*fpsInterval/(rawTime-lastTime);
		lastTime=rawTime;
		document.getElementById("status").innerHTML="Running; "+fpsLast.toFixed(2)+"fps ("+fpsAll.toFixed(2)+"fps since start)";
	}
}

function startSim(){
	var startTime=+(new Date().getTime());
	var g=setInterval(_draw,1000/fps,c,notelist,startTime);
	stopSim=function(){
		clearInterval(g);
		c.reset();
		document.getElementById("status").innerHTML="Stopped";
	}
	document.getElementById("status").innerHTML="Running";
	lastTime=0;
}

