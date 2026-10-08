const fs = require('fs');
let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

if (!content.includes('import confetti')) {
  content = content.replace(
    'import { StatBadge } from "@/components/shared";',
    'import { StatBadge } from "@/components/shared";\nimport confetti from "canvas-confetti";'
  );
}

const animatedStreakComponent = `
function AnimatedStreakCard({ initialStreak }: { initialStreak: number }) {
  const [ignited, setIgnited] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIgnited(true);
      soundEffects.playIgnite();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-700/60 border-b-4 border-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg w-full">
      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
        STREAK
      </span>
      <div className={\`flex items-center gap-1.5 transition-all duration-500 \${ignited ? "" : "grayscale opacity-40"}\`}>
        <Flame className={\`w-5 h-5 transition-all duration-500 \${ignited ? "text-orange-400 fill-orange-400 drop-shadow-[0_0_14px_rgba(249,115,22,0.8)]" : "text-slate-400 fill-slate-400"}\`} />
        <span className={\`text-2xl font-black font-mono transition-all duration-500 \${ignited ? "text-orange-400 animate-in zoom-in-125 duration-300" : "text-slate-400"}\`}>
          {ignited ? initialStreak + 1 : initialStreak}
        </span>
      </div>
    </div>
  );
}

export function LessonPlayer`;

content = content.replace('export function LessonPlayer', animatedStreakComponent);

const isFinishedStart = '  if (isFinished) {';
const isFinishedEnd = '    );';

const beforeIsFinished = content.substring(0, content.indexOf(isFinishedStart));
const remainingAfterIf = content.substring(content.indexOf(isFinishedStart));
const afterIsFinished = remainingAfterIf.substring(remainingAfterIf.indexOf(isFinishedEnd) + isFinishedEnd.length + 4);

const newIsFinished = `  if (isFinished) {
    const isPerfectRun = mistakesCount === 0;
    const earnedXP = isPerfectRun ? 20 : 15;
    const accuracyPercentage = Math.round(Math.max(0, ((steps.length - mistakesCount) / steps.length) * 100));

    // Fire confetti on mount
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
    }, []);

    return (
      <div className="fixed inset-0 z-50 bg-[#101826] flex flex-col items-center justify-between p-6 sm:p-8 animate-in fade-in zoom-in-95 select-none overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full gap-5 my-auto">
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

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
            Lesson Completed!
          </h2>

          {isPerfectRun && (
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-in zoom-in spin-in-2 duration-500 font-mono">
              <Sparkles className="w-4 h-4" />
              PERFECT RUN (+5 BONUS XP)
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 w-full my-6">
            <div className="bg-slate-900/60 border border-slate-700/60 border-b-4 border-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg w-full">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                TOTAL XP
              </span>
              <span className="text-sky-400 text-2xl font-black font-mono">
                <AnimatedXpCounter target={earnedXP} />
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-700/60 border-b-4 border-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg w-full">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                ACCURACY
              </span>
              <span className="text-emerald-400 text-2xl font-black font-mono animate-in zoom-in spring-bounce-50 duration-500">
                {accuracyPercentage}%
              </span>
            </div>

            <AnimatedStreakCard initialStreak={streakCount} />
          </div>
        </div>

        <div className="w-full max-w-lg mt-6 shrink-0">
          <button
            type="button"
            onClick={() => onComplete(earnedXP)}
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-[0px] text-white font-black text-lg select-none transition-all cursor-pointer"
          >
            CONTINUE TO ROADMAP
          </button>
        </div>
      </div>
    );
  }`;

content = beforeIsFinished + newIsFinished + afterIsFinished;

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
