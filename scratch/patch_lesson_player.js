const fs = require('fs');

let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

// Add mistakesCount state
content = content.replace(
  'const [batteryCount, setBatteryCount] = useState(5);',
  'const [batteryCount, setBatteryCount] = useState(5);\n  const [mistakesCount, setMistakesCount] = useState(0);'
);

// Update handleUserInput to play click sound
content = content.replace(
  'setUserInput(val);\n  };',
  'setUserInput(val);\n    soundEffects.playClick();\n  };'
);

// Update handleCheck for incorrect answers
content = content.replace(
  'soundEffects.playIncorrect();\n      setEvaluationState("incorrect");\n      setIsShaking(true);',
  `soundEffects.playIncorrect();
      setEvaluationState("incorrect");
      setIsShaking(true);
      setMistakesCount((prev) => prev + 1);
      setBatteryCount((prev) => Math.max(0, prev - 1));`
);

// Update isFinished logic
content = content.replace(
  'soundEffects.playCorrect();\n        setIsFinished(true);',
  `soundEffects.playVictory();
        setIsFinished(true);`
);

// Replace victory screen XP and badge logic
// Replace the entire if (isFinished) { return ( ... ); } block
const victoryScreenOld = `    if (isFinished) {
      return (
        <div className="fixed inset-0 z-50 bg-[#101826] flex flex-col items-center justify-between p-6 sm:p-8 
animate-in fade-in zoom-in-95 select-none overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md w-full gap-5 my-auto">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-sky-500/25 
blur-3xl rounded-full scale-125 pointer-events-none" />
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                <img
                  src="/images/buggy-victory.png"
                  alt="Victory Mascot"
                  className="w-full h-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)] animate-bounce"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border 
border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-2 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                Lesson Complete!
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
                {lesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
                You crushed all challenges and mastered this node!
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 border-b-4 
border-b-amber-500/40 flex flex-col items-center justify-center shadow-lg">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">
                    XP EARNED
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-amber-400">
                  <AnimatedXpCounter target={lesson.totalXp} />
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 border-b-4 
border-b-emerald-500/40 flex flex-col items-center justify-center shadow-lg">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">
                    ACCURACY
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  100%
                </span>
              </div>
            </div>

            <div className="w-full flex items-center justify-around py-3 px-4 rounded-2xl bg-slate-900/80 border 
border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>{streakCount + 1} Days Streak</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="text-slate-400">
                +1 Day Added
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mt-6 shrink-0">
            <button
              onClick={() => onComplete(lesson.totalXp)}
              className="w-full py-4 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 border-b-4 border-emerald-700 text-slate-950 font-black text-[15px] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      );
    }`;

const victoryScreenNew = `    if (isFinished) {
      const isPerfectRun = mistakesCount === 0;
      const earnedXP = isPerfectRun ? 20 : 15;
      const accuracyPercentage = Math.round(Math.max(0, ((steps.length - mistakesCount) / steps.length) * 100));

      return (
        <div className="fixed inset-0 z-50 bg-[#101826] flex flex-col items-center justify-between p-6 sm:p-8 animate-in fade-in zoom-in-95 select-none overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md w-full gap-5 my-auto">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-sky-500/25 blur-3xl rounded-full scale-125 pointer-events-none" />
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                <img
                  src="/images/buggy-victory.png"
                  alt="Victory Mascot"
                  className="w-full h-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)] animate-bounce"
                />
              </div>
            </div>

            {isPerfectRun && (
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-in zoom-in spin-in-2 duration-500 font-mono">
                <Sparkles className="w-4 h-4" />
                Perfect Run
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-2 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Lesson Complete!
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
                {lesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
                {isPerfectRun ? "Flawless victory! You truly mastered this node." : "Great job completing this challenge!"}
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 border-b-4 border-b-amber-500/40 flex flex-col items-center justify-center shadow-lg">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">
                    XP EARNED
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-amber-400">
                  <AnimatedXpCounter target={earnedXP} />
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 border-b-4 border-b-emerald-500/40 flex flex-col items-center justify-center shadow-lg">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">
                    ACCURACY
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {accuracyPercentage}%
                </span>
              </div>
            </div>

            <div className="w-full flex items-center justify-around py-3 px-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>{streakCount + 1} Days Streak</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="text-slate-400">
                +1 Day Added
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mt-6 shrink-0">
            <button
              onClick={() => onComplete(earnedXP)}
              className="w-full py-4 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 border-b-4 border-emerald-700 text-slate-950 font-black text-[15px] uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      );
    }`;

content = content.replace(victoryScreenOld, victoryScreenNew);

// Add battery modal
const batteryModal = `
      {batteryCount === 0 && (
        <div className="fixed inset-0 z-[60] bg-[#101826]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-rose-500 fill-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">Out of Energy!</h2>
            <p className="text-slate-400 font-medium mb-8">
              You've made too many mistakes and ran out of energy. Recharge to try again!
            </p>
            <button
              onClick={onExit}
              className="w-full py-4 px-8 rounded-2xl bg-rose-500 hover:bg-rose-400 active:translate-y-1 border-b-4 border-rose-700 text-white font-black text-[15px] uppercase tracking-wider transition-all cursor-pointer"
            >
              Back to Path
            </button>
          </div>
        </div>
      )}
`;

content = content.replace('    <div className="relative w-full h-[100dvh] bg-[#101826] overflow-hidden flex flex-col">', '    <div className="relative w-full h-[100dvh] bg-[#101826] overflow-hidden flex flex-col">' + batteryModal);

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
