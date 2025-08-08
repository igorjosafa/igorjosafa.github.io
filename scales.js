import { notesList } from "./notes.js";

class threeOctavesScale {
  constructor(firstOctaveScale) {
    this.firstOctaveScale = firstOctaveScale;
    this.secondOctaveScale = new (eval(firstOctaveScale.constructor.name))(
      firstOctaveScale.fundamentalNote, firstOctaveScale.octave + 1, firstOctaveScale.intervals
    )
    this.thirdOctaveScale = new (eval(firstOctaveScale.constructor.name))(
      firstOctaveScale.fundamentalNote, firstOctaveScale.octave + 2, firstOctaveScale.intervals
    )

    this.notes = this.firstOctaveScale.scaleNotes.slice(0, 7).concat(
      this.secondOctaveScale.scaleNotes.slice(0, 7)
    ).concat(
      this.thirdOctaveScale.scaleNotes.slice(0, 7)
    )
  }
}

class sevenNotesScale {
  constructor(fundamentalNote, octave, intervals) {
    this.fundamentalNote = fundamentalNote;
    this.octave = octave;
    this.intervals = intervals;

    const allNotes = notesList.getOctaveStartingFrom(this.fundamentalNote, this.octave);
    this.firstNote = allNotes[intervals[0]];
    this.secondNote = allNotes[intervals[1]];
    this.thirdNote = allNotes[intervals[2]];
    this.fourthNote = allNotes[intervals[3]];
    this.fifthNote = allNotes[intervals[4]];
    this.sixthNote = allNotes[intervals[5]];
    this.seventhNote = allNotes[intervals[6]];
    this.eighthNote = allNotes[intervals[7]];
    this.scaleNotes = [
      this.firstNote, 
      this.secondNote, 
      this.thirdNote, 
      this.fourthNote, 
      this.fifthNote, 
      this.sixthNote, 
      this.seventhNote, 
      this.eighthNote
    ];
  }


  play(player, volume = 0.5, duration = 0.5) {
      this.scaleNotes.forEach((note, index) => {
          setTimeout(() => {
              note.play(player, volume, duration);
          }, index * duration * 1000);
      });
    }
}

class ionianScale extends sevenNotesScale {
  constructor(fundamentalNote, octave) {
    super(fundamentalNote, octave, [0, 2, 4, 5, 7, 9, 11, 12]);
  }
}

class dorianScale extends sevenNotesScale {
  constructor(fundamentalNote, octave) {
    super(fundamentalNote, octave, [0, 2, 3, 5, 7, 9, 10, 12]);
  }
}

class phrygianScale extends sevenNotesScale {
  constructor(fundamentalNote, octave) {
    super(fundamentalNote, octave, [0, 1, 3, 5, 7, 8, 10, 12]);
  }
}

class lydianScale extends sevenNotesScale {
  constructor(fundamentalNote, octave) {
    super(fundamentalNote, octave, [0, 2, 4, 6, 7, 9, 11, 12]);
  }
}

class mixolydianScale extends sevenNotesScale {
  constructor(fundamentalNote, octave) {
    super(fundamentalNote, octave, [0, 2, 4, 5, 7, 9, 10, 12]);
  }
}

class aeolianScale extends sevenNotesScale {
  constructor(fundamentalNote, octave) {
    super(fundamentalNote, octave, [0, 2, 4, 5, 7, 9, 11, 12]);
  }
}

class locrianScale extends sevenNotesScale {
  constructor(fundamentalNote, octave) {
    super(fundamentalNote, octave, [0, 1, 3, 5, 7, 8, 10, 12]);
  }
}

export { ionianScale, dorianScale, phrygianScale, lydianScale, mixolydianScale, aeolianScale, locrianScale, threeOctavesScale };