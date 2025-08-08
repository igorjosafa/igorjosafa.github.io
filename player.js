class Player {
    constructor(audioCtx, oscillatorType = 'sine') {
        this.oscillatorType = oscillatorType;
        this.audioCtx = audioCtx;
    }
    
    playNote(frequency, volume, duration) {
        const oscillator = this.#getOscillator(frequency, volume);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);

        oscillator.onended = () => {
            oscillator.disconnect();
        };
    }

    #getOscillator(freq, volume) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        if (!isFinite(freq)) {
            console.warn("Frequência inválida detectada:", freq)
            return null
        }

        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime)
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime)
        osc.type = this.oscillatorType
        osc.connect(gain).connect(this.audioCtx.destination)
        return osc
    }
}

export { Player };