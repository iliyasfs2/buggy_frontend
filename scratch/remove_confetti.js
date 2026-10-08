const fs = require('fs');
let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

// Remove import
content = content.replace('import confetti from "canvas-confetti";\n', '');

// Remove the top-level useEffect block for confetti
const useEffectBlock = `  useEffect(() => {
    if (!isFinished) return;
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#34d399', '#fbbf24']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#34d399', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isFinished]);\n\n`;

content = content.replace(useEffectBlock, '');

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
