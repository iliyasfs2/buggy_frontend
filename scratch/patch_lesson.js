const fs = require('fs');

let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

// 1. Imports
content = content.replace(
  'import { useNavStore } from "@/store/useNavStore";',
  'import { useNavStore, selectBatteryCount } from "@/store/useNavStore";\nimport { decreaseBatteryApi, rechargeBatteryApi } from "@/services/progressApi";'
);

// 2. State setup
content = content.replace(
  'const [batteryCount, setBatteryCount] = useState(5);',
  'const batteryCount = useNavStore(selectBatteryCount);\n  const setBatteryCount = useNavStore((state) => state.setBatteryCount);'
);

// 3. handleIncorrect
content = content.replace(
  'setBatteryCount((prev) => Math.max(0, prev - 1));',
  'decreaseBatteryApi().then(res => setBatteryCount(res.battery)).catch(console.error);'
);

// 4. Defeat Modal
const searchStr = `{batteryCount === 0 && (
        <div className="fixed inset-0 z-[60] bg-[#101826]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-rose-500 fill-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">Out of Energy!</h2>
            <p className="text-slate-400 font-medium mb-8">
              You&apos;ve made too many mistakes and ran out of energy. Recharge to try again!
            </p>
            <button
              onClick={onExit}
              className="w-full py-4 px-8 rounded-2xl bg-rose-500 hover:bg-rose-400 active:translate-y-1 border-b-4 border-rose-700 text-white font-black text-[15px] uppercase tracking-wider transition-all cursor-pointer"
            >
              Back to Path
            </button>
          </div>
        </div>
      )}`;

const replacementStr = `{batteryCount === 0 && (
        <div className="fixed inset-0 z-[60] bg-[#101826]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900/90 border border-slate-700/60 border-b-4 border-slate-950 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-[0_0_40px_rgba(225,29,72,0.15)] animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
            
            <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-4 relative drop-shadow-[0_10px_20px_rgba(225,29,72,0.4)]">
              <img
                src="/images/buggy-defeat.png"
                alt="Defeat Mascot"
                className="w-full h-full object-contain grayscale-[0.2] sepia-[0.3] hue-rotate-[-20deg]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML = \`<div class="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>\`;
                }}
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-2 relative z-10">باتری تموم شد!</h2>
            <p className="text-slate-400 font-medium mb-8 text-sm sm:text-base relative z-10">
              برای ادامه حل سوالات نیاز به شارژ باتری داری.
            </p>
            
            <div className="flex flex-col w-full gap-3 relative z-10">
              <button
                onClick={() => {
                  rechargeBatteryApi().then(res => setBatteryCount(res.battery)).catch(console.error);
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:translate-y-1 border-b-4 border-amber-700 active:border-b-[0px] text-slate-950 font-black text-[14px] sm:text-[15px] uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
                شارژ سریع رایگان
              </button>
              
              <button
                onClick={onExit}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-4 border-slate-900 active:border-b-[0px] text-slate-300 font-bold text-[14px] sm:text-[15px] transition-all cursor-pointer"
              >
                بازگشت به نقشه
              </button>
            </div>
          </div>
        </div>
      )}`;

content = content.replace(searchStr, replacementStr);

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
