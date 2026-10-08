const fs = require('fs');
let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

// Remove handleSkip
const handleSkipString = `  const handleSkip = useCallback(() => {
    soundEffects.playSwoosh();
    setMistakesCount((prev) => prev + 1);
    
    if (currentStepIndex + 1 < steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setUserInput(null);
      setEvaluationState("idle");
    } else {
      soundEffects.playVictory();
      setIsFinished(true);
    }
  }, [currentStepIndex, steps.length]);

`;
content = content.replace(handleSkipString, '');

// Remove Skip button from footer
const skipButtonString = `          <button
            type="button"
            onClick={handleSkip}
            className="text-slate-400 hover:text-white hover:bg-slate-800/40 font-bold px-6 py-4 rounded-2xl transition-colors cursor-pointer"
          >
            Skip
          </button>`;

content = content.replace(skipButtonString, '');

// Change the footer justify-between to justify-end so the Check button aligns correctly without the skip button
content = content.replace(
  '<div className="w-full max-w-xl mx-auto px-4 flex items-center justify-between">',
  '<div className="w-full max-w-xl mx-auto px-4 flex items-center justify-end">'
);

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
