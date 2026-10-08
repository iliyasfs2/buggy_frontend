const fs = require('fs');
let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

const handleSkip = `
  const handleSkip = useCallback(() => {
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

  const handleCheck`;

content = content.replace('  const handleCheck', handleSkip);

const oldFooterStart = '      <footer';
const oldFooterEnd = '</footer>';

const beforeFooter = content.substring(0, content.indexOf(oldFooterStart));
const afterFooter = content.substring(content.indexOf(oldFooterEnd) + oldFooterEnd.length);

const newFooter = `      {evaluationState === "correct" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-950/90 border-t-2 border-emerald-500/40 backdrop-blur-md px-6 py-5 flex items-center animate-in slide-in-from-bottom-full duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="w-full max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-emerald-400">
                Nicely done!
              </h4>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 text-slate-950 font-black rounded-2xl px-8 py-4 active:translate-y-1 active:border-b-[0px] transition-all cursor-pointer shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <footer className="w-full shrink-0 bg-[#101826] border-t border-slate-800 py-4 relative z-40">
        <div className="w-full max-w-xl mx-auto px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            className="text-slate-400 hover:text-white hover:bg-slate-800/40 font-bold px-6 py-4 rounded-2xl transition-colors cursor-pointer"
          >
            Skip
          </button>
          <button
            type="button"
            disabled={!hasInput}
            onClick={handleCheck}
            className={\`px-8 py-4 rounded-2xl font-black text-[15px] uppercase tracking-wider transition-all duration-200 \${
              hasInput
                ? "bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-[0px] text-white cursor-pointer shadow-lg"
                : "bg-slate-800 border-b-4 border-slate-900 text-slate-500 cursor-not-allowed"
            }\`}
          >
            Check
          </button>
        </div>
      </footer>`;

content = beforeFooter + newFooter + afterFooter;

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
