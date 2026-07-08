import { 
    ionianScale, 
    dorianScale, 
    phrygianScale, 
    lydianScale, 
    mixolydianScale, 
    aeolianScale, 
    locrianScale 
} from "./scales.js";

import {
    HarmonicField
} from "./harmonicFields.js"

class Key {
    constructor(key, scale, degrees=[1, 3, 5], octave=3) {
        this.key = key;
        this.scale = scale;
        this.octave = octave;
        this.scale = new (eval(`${scale}Scale`))(this.key, this.octave);
        this.harmonicField = new HarmonicField(this.scale, degrees);
        this.extendedScale = this.harmonicField.notes;

        this.name = `${this.scale.name} (${this.key.toUpperCase()})`.replace('SHARP', '#')

        this.playing = false;
    }

    toString() {
        return this.name;
    }

    playScale(play, volume = 0.5, duration = 0.5) {
        this.scale.play(play, volume, duration)
    }

    playScaleDescending(play, volume = 0.5, duration = 0.5) {
        this.scale.playDescending(play, volume, duration)
    }

    playHarmonicField(play, volume = 0.5, duration = 0.5) {
        this.harmonicField.play(play, volume, duration)
    }

    playHarmonicFieldDescending(play, volume = 0.5, duration = 0.5) {
        this.harmonicField.playDescending(play, volume, duration)
    }

    playProgression(play, chords = [], volume = 0.1, duration = 0.5) {
        if (!this.playing) {
            this.harmonicField.startLoop(
                chords,
                player,
                volume,
                duration
            );
            this.playing = true;
            return;
        }

        this.harmonicField.stop();
        this.playing = false;
    }

}

export { Key }