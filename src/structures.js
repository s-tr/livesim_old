function Note(time,origin,lane,type){
	this.origin=origin;
	this.lane=lane;
	this.time=time;
	this.type=type;
	this.noteType=noteNames[type];
	this.decoration={};
}

Note.ETC         = 0;
Note.HIT         = 1;
Note.SWIPE_L     = 2;
Note.SWIPE_R     = 3;
Note.SWIPE_U     = 4;
Note.SWIPE_D     = 5;
Note.SWIPE       = 6;
Note.LN_BEGIN    = 7;
Note.LN_MID      = 8;
Note.LN_END      = 9;

var noteNames = [
	"NOTE_ETC", "NOTE_HIT", "NOTE_SWIPE_LEFT", "NOTE_SWIPE_RIGHT", "NOTE_SWIPE_UP",
	"NOTE_SWIPE_DOWN", "NOTE_SWIPE", "NOTE_LN_START", "NOTE_LN_TICK", "NOTE_LN_END"
];

Note.prototype.isVisible = function(curTime,apprTime){
	return (this.time>=curTime && this.time<=curTime+apprTime);
}

/**
 * Defines a LN.
 *
 * `arr` is defined in the following format:
 *  [
 *      [time0, origin0, lane0],
 *      [time1, origin1, lane1],
 *      ...
 *      [timeN, originN, laneN, typeN]
 *  ]
 * There will be a minimum of 2 notes in an LN (the beginning and the end)
 *
 * The first note has to have type LN_BEGIN.
 * Other than the first and last note, all notes have to have
 * type LN_MID.
 *
 * Obviously I'm not checking this, this is up to you
 */
function LN(arr){
	if(arr.length<2){
		console.log("Malformed LN!");
		return 0;
	}
	this.notes=[];
	this.notes[0]=new Note(arr[0][0],arr[0][1], Note.LN_BEGIN);
	for(var i=1;i<arr.length-1;i++){
		this.notes[i]=new Note(arr[i][0],arr[i][1], Note.LN_MID);
	}
	this.notes[arr.length-1]=new Note(arr[arr.length-1][0],arr[arr.length-1][1], arr[arr.length-1][2]);
	
	this.noteType="LN";
}

LN.prototype.isVisible = function(curTime,apprTime) {
	if((this.notes[0].time<curTime+apprTime) && (this.notes[this.notes.length-1].time>curTime)){
		return true;
	} else {
		return false;
	}
}

function Song(notes,timing){
	this.notes=notes;
	this.timing=timing;
}

