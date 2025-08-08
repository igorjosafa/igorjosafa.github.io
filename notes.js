class Note {
    constructor(name, octave, frequency) {
        this.name = name;
        this.octave = octave;
        this.frequency = frequency;
    }

    play(player, volume, duration) {
        player.playNote(this.frequency, volume, duration);
    }
}

class baseNote {
    constructor(name, octave, frequency) {
        this.name = name;
        this.octave = octave;
        this.frequency = frequency;
    }

    createNote(octave) {
        return new Note(this.name, octave, this.frequency * Math.pow(2, octave));
    }
}

class notesList {
    static notesList = [
        'c', 'cSharp', 'd', 'dSharp', 'e', 'f', 'fSharp', 'g', 'gSharp', 'a', 'aSharp', 'b', 
        'c', 'cSharp', 'd', 'dSharp', 'e', 'f', 'fSharp', 'g', 'gSharp', 'a', 'aSharp', 'b'
    ];

    static getOctaveStartingFrom(note, octave) {
        const startIndex = this.notesList.indexOf(note);
        if (startIndex === -1) {
            throw new Error('Note not found in the list');
        }
        return this.notesList.slice(startIndex, startIndex + 13).map((n, i) => {
            if (n === 'c' && i > 0) {
                octave += 1; // Increment octave for the next C note
            }
            return baseNotes[n].createNote(octave);
        });
    }
}

const baseNotes = {
    c: new baseNote('C', 0, 32.7032/2), // C0
    cSharp: new baseNote('C#', 0, 34.6478/2),
    d: new baseNote('D', 0, 36.7081/2),
    dSharp: new baseNote('D#', 0, 38.8909/2),
    e: new baseNote('E', 0, 41.203/2),
    f: new baseNote('F', 0, 43.6535/2),
    fSharp: new baseNote('F#', 0, 46.2493/2),
    g: new baseNote('G', 0, 49/2),
    gSharp: new baseNote('G#', 0, 51.9131/2),
    a: new baseNote('A', 0, 27.5),
    aSharp: new baseNote('A#', 0, 29.1352),
    b: new baseNote('B', 0, 30.8677),
};

export { baseNotes, notesList };

