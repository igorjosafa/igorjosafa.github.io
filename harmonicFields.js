import { threeOctavesScale } from "./scales.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class Chord {
    constructor(notes) {
        this.notes = notes;
    }

    play(player, volume, duration, octaveShifter = 1) {
        this.notes.forEach(note =>
            note.play(player, volume, duration, octaveShifter)
        );
    }
}

class HarmonicField {
    constructor(scale, degrees) {
        this.notes = new threeOctavesScale(scale).notes;

        const baseIndexes = degrees.map(d => d - 1);

        this.chords = [];

        // monta todos os acordes do campo harmônico
        for (let i = 0; i < 8; i++) {
            const chordNotes = baseIndexes.map(index => this.notes[index + i]);
            this.chords.push(new Chord(chordNotes));
        }

        this.running = false;
    }

    getChord(degree) {
        return this.chords[degree - 1];
    }

    async playProgression(
        progression,
        player,
        volume = 0.5,
        duration = 0.5,
        pause = duration
    ) {
        for (const degree of progression) {
            if (!this.running) return;

            this.getChord(degree).play(player, volume, duration);

            await sleep(pause * 1000);
        }
    }

    async startLoop(
        progression,
        player,
        volume = 0.5,
        duration = 0.5,
        pause = duration
    ) {
        this.stop();

        this.running = true;

        while (this.running) {
            await this.playProgression(
                progression,
                player,
                volume,
                duration,
                pause
            );
        }
    }

    stop() {
        this.running = false;
    }

    async play(
        player,
        volume = 0.5,
        duration = 0.5
    ) {
        this.running = true;

        const progression = Array.from(
            { length: this.chords.length },
            (_, i) => i + 1
        );

        await this.playProgression(
            progression,
            player,
            volume,
            duration
        );

        this.running = false;
    }

    async playDescending(
        player,
        volume = 0.5,
        duration = 0.5
    ) {
        this.running = true;

        const progression = Array.from(
            { length: this.chords.length },
            (_, i) => this.chords.length - i
        );

        await this.playProgression(
            progression,
            player,
            volume,
            duration
        );

        this.running = false;
    }
}

export { HarmonicField };