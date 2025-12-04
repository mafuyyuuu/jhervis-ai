// Sound effects utility for UI feedback
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Play a simple beep sound
    playBeep(frequency = 800, duration = 0.1, volume = 0.1) {
        if (!this.enabled) return;
        this.init();
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Speaking start sound
    playSpeakingStart() {
        this.playBeep(600, 0.08, 0.05);
        setTimeout(() => this.playBeep(800, 0.08, 0.05), 80);
    }

    // Speaking end sound
    playSpeakingEnd() {
        this.playBeep(800, 0.08, 0.05);
        setTimeout(() => this.playBeep(600, 0.08, 0.05), 80);
    }

    // Listening start sound
    playListeningStart() {
        this.playBeep(1000, 0.1, 0.06);
    }

    // Message received sound
    playMessageReceived() {
        this.playBeep(1200, 0.05, 0.04);
        setTimeout(() => this.playBeep(1400, 0.05, 0.04), 50);
    }

    // Click feedback
    playClick() {
        this.playBeep(1000, 0.03, 0.03);
    }

    // Section change sound
    playSectionChange() {
        this.playBeep(400, 0.15, 0.03);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

export const soundEffects = new SoundEffects();
export default soundEffects;
