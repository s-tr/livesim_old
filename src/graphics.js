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
 *     given the starting and ending positions/offsets.
 * 
 * 
 * Position functions
 * 
 * position() takes five arguments:
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
 * 
 * 
 * Raw note drawing functions
 * 
 * __drawNote() takes two values:
 * 1. An array in the form returned by position()
 * 2. The type of note (see structures.js)
 * 
 * __drawLNConnect() takes five values:
 * 1. The current time
 * 2. The time offset of the beginning of the connector
 * 3. The lane of the beginning of the connector
 * 4. The time offset of the end of the connector
 * 5. The lane of the end of the connector
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

var __initTable={};

function __registerInit(name,f){
	__initTable[name]=f;
}

