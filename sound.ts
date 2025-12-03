
let audioCtx: AudioContext | null = null;

export const playClickSound = () => {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        audioCtx = new Ctx();
      }
    }
    
    if (!audioCtx) return;

    // Resume context if suspended
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // New Sound: "Tech Blip" / "Glass Tap"
    // Higher pitch, triangle wave for more 'digital' feel, very short decay
    osc.type = 'triangle';
    
    // Pitch envelope: High to slightly lower (Crisp)
    osc.frequency.setValueAtTime(2000, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    
    // Volume envelope: Sharp attack, fast release
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime); // Lower volume slightly as high pitch is perceived louder
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);

  } catch (e) {
    console.error("Audio play failed", e);
  }
};
