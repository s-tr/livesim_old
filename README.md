     _       ___  __     __  _____   ____    ___   __  __ 
    | |     |_ _| \ \   / / | ____| / ___|  |_ _| |  \/  |
    | |      | |   \ \ / /  |  _|   \___ \   | |  | |\/| |
    | |___   | |    \ V /   | |___   ___) |  | |  | |  | |
    |_____| |___|    \_/    |_____| |____/  |___| |_|  |_|
                                                       
          Written by supersofttomboy aka. sstb/esther
                         version 0.0.1


    This program is a player for custom charts for the rhythm games
BanG Dream! Girls Band Party and Love Live! School Idol Festival.

USAGE
=====

The program is run from the file "player.html" in the root directory
of this repository.

Upon loading the page, you need to select the game mode (Bandori or
SIF) from the upper right section. Then, enter the timing information 
and notes for the chart in the respective windows. Finally, control the
simulator using the buttons below the playfield area.

TIMING
======

The syntax for the timing information is as follows:
    
```
    TimingInfo  ::= Statement
    Statement   ::= Direct | Inherited
    Direct      ::= "d" Number Number Number Number"\n"
    Inherited   ::= "i" Number Number "\n"
```

Each line represents either a **direct** section or an *inherited*
timing section. People familiar with osu! mapping may recognise the
latter term. 

A direct section statement represents a change in timing. Its values
are, from left to right,

* the offset of the beginning of the section,  
* the beats per minute (bpm) of the section,
* the number of beats per bar,
* and the scroll speed.

An interited section statement represents a change in track velocity.
Its values are, from left to right,

* the offset of the change of velocity,
* the new scroll speed.

Scroll speed is expressed in units per second. By default, the distance
between the spawn point of the notes and the judgement point is 100.0
units. So, the time between spawn and hit is (100/speed) seconds.

NOTES
=====

The syntax for notes is as follows:

```
	NoteList   ::= Note+
	Note       ::= Hit | LN
	Hit        ::= "h" NoteInfo "\n"
	LN         ::= "l" Integer "\n" LNNode+
	LNNode     ::= NoteInfo "\n"
	NoteInfo   ::= Number Number Number Number Number Integer Integer
```

NoteInfo's values are, from left to right: 

* The direct timing section the note is in,  
* the bar number of the note (counting from 0),
* the beat the note falls on (counting from 0),
* the lane the note will be hit in,
* the origin of the note
* the type of note,


If the direct timing section is set to -1, the second argument is instead
taken as the literal timing of the note.
For Bandori and SIF modes, the origin of the note is ignored.

Hit's values are

