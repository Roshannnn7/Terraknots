import confetti from 'canvas-confetti';

export const triggerOrderSuccess = () => {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#C4A882', '#A8B5A2', '#D4A574'] // Brand Colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#C4A882', '#A8B5A2', '#D4A574']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};
