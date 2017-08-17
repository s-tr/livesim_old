/**
 * timing.js - Utility code for timing a song
 */

/**
 * TimingInfo expresses the timing sections of a song in terms of offset,
 * beats per minute and beats per measure.
 * 
 * The input is of the following format:
 * [
 *     { "offset" : offset1, "bpm" : bpm1, "measure" : m1 },
 *    ...
 * ]
 */
function TimingInfo(timingInfo){
	this.timingInfo=timingInfo;
}

/**
 * Allows the user to do the timing of notes in a human-readable form
 * instead of needing to manually calculate all the timings themselves.
 */
TimingInfo.prototype.time = function(section,bar,beat){
	if(section==-1){
		return bar;
	}
	else {
		var sect=this.timingInfo[section];
		return sect.offset+(bar*sect.measure+beat)*60.0/sect.bpm;
	}
}

/**
 * Converts, in place, a note from human-readable form [section,bar,beat]
 * to its raw timing value.
 */
TimingInfo.prototype.convert = function(note){
	if(note.noteType=="LN"){
		this.convertAll(note.notes);
	} else {
		note.time=this.time.apply(this,note.time);
	}
}

/**
 * Converts, in place, a whole array of notes from human-readable form
 * [section,bar,beat] to its raw timing value.
 */
TimingInfo.prototype.convertAll = function(noteList){
	for(var i=0;i<noteList.length;i++){
		this.convert(noteList[i]);
	}
}
			

