import { threeOctavesScale } from "./scales.js";

class Chord {
    constructor(notes) {
        this.notes = notes;
    }

    play(player, volume, duration) {
        this.notes.forEach((note) => {
            note.play(player, volume, duration)
        });
    }
}

class HarmonicField {
    constructor(scale, degrees) {
        this.notes = new threeOctavesScale(scale).notes
        let indexes = degrees
        indexes = indexes.map((index) => index - 1);
        let chordNotes = indexes.map(index => this.notes.at(index))
        this.firstChord = new Chord(chordNotes)

        indexes = indexes.map((index) => index + 1);
        chordNotes = indexes.map(index => this.notes.at(index))
        this.secondChord = new Chord(chordNotes)

        indexes = indexes.map((index) => index + 1);
        chordNotes = indexes.map(index => this.notes.at(index))
        this.thirdChord = new Chord(chordNotes)

        indexes = indexes.map((index) => index + 1);
        chordNotes = indexes.map(index => this.notes.at(index))
        this.fourthChord = new Chord(chordNotes)

        indexes = indexes.map((index) => index + 1);
        chordNotes = indexes.map(index => this.notes.at(index))
        this.fifthChord = new Chord(chordNotes)

        indexes = indexes.map((index) => index + 1);
        chordNotes = indexes.map(index => this.notes.at(index))
        this.sixthChord = new Chord(chordNotes)

        indexes = indexes.map((index) => index + 1);
        chordNotes = indexes.map(index => this.notes.at(index))
        this.seventhChord = new Chord(chordNotes)

        indexes = indexes.map((index) => index + 1);
        chordNotes = indexes.map(index => this.notes.at(index))
        this.eighthChord = new Chord(chordNotes)

        this.chords = [
            this.firstChord,
            this.secondChord,
            this.thirdChord,
            this.fourthChord,
            this.fifthChord,
            this.sixthChord,
            this.seventhChord,
            this.eighthChord,
        ]
    }

    play(player, volume = 0.5, duration = 0.5) {
      this.chords.forEach((chord, index) => {
          setTimeout(() => {
              chord.play(player, volume, duration);
          }, index * duration * 1000);
      });
    }


    playDescending(player, volume = 0.5, duration = 0.5) {
      let chords = [];

      for (let i=this.chords.length-1; i>=0; i--) {
        chords = chords.concat(this.chords[i]);
      }

      chords.forEach((chord, index) => {
          setTimeout(() => {
              chord.play(player, volume, duration);
          }, index * duration * 1000);
      });
    }

}

export { HarmonicField }