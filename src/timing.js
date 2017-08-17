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

TimingInfo.prototype.convert = function(note){
	if(note.noteType=="LN"){
		this.autoConvert(note.notes);
	} else {
		note.time=this.time.apply(this,note.time);
	}
}

TimingInfo.prototype.autoConvert = function(noteList){
	for(var i=0;i<noteList.length;i++){
		this.convert(noteList[i]);
	}
}
			

