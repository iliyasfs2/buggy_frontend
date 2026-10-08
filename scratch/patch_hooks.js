const fs = require('fs');
let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

// Remove the inline useEffect from isFinished
const inlineEffect = `    // Fire confetti on mount
    useEffect(() => {
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
    }, []);`;

content = content.replace(inlineEffect, '');

// Add the top-level useEffect before isFinished
const topLevelEffect = `
  useEffect(() => {
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
  }, [isFinished]);

  if (isFinished) {`;

content = content.replace('  if (isFinished) {', topLevelEffect);

content = content.replace('spring-bounce-50', '');

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
