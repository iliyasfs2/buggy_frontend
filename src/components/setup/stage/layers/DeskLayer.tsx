import type { ReactElement } from "react";
import { CoffeeSteam } from "../effects/CoffeeSteam";

export interface DeskLayerProps {
  monitor: string;
  keyboard: string;
  drink: string;
  isMugSipping?: boolean;
  isScreenFlickering?: boolean;
  onScreenClick?: () => void;
  onMugClick?: () => void;
}

export function DeskLayer({
  monitor,
  keyboard,
  drink,
  isMugSipping = false,
  isScreenFlickering = false,
  onScreenClick,
  onMugClick
}: DeskLayerProps): ReactElement {
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none select-none flex flex-col items-center">
      <div className="relative w-full max-w-2xl px-2 sm:px-6 flex flex-col items-center">
        <div className="relative z-10 flex flex-col items-center mb-[-2px]">
          <div
            onClick={onScreenClick}
            className={`pointer-events-auto cursor-pointer relative w-60 sm:w-80 md:w-96 h-36 sm:h-44 md:h-48 bg-[#0b101b] border-4 border-slate-700/90 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-150 active:scale-[0.99] ${
              isScreenFlickering ? "brightness-125 border-cyan-400 ring-4 ring-cyan-500/30" : ""
            }`}
          >
            <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 border-b-2 border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>App.tsx</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500 font-semibold">BUGGY_OS</div>
            </div>

            <div className="flex-1 p-2.5 sm:p-3 font-mono text-[9px] sm:text-[11px] text-slate-300 flex flex-col justify-around relative overflow-hidden bg-slate-950/90">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 select-none text-[9px]">1</span>
                <span><span className="text-pink-400 font-bold">import</span> &#123; <span className="text-cyan-300">useDeveloper</span> &#125; <span className="text-pink-400 font-bold">from</span> <span className="text-emerald-300">&quot;buggy&quot;</span>;</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 select-none text-[9px]">2</span>
                <span><span className="text-pink-400 font-bold">export default function</span> <span className="text-yellow-300 font-bold">Battlestation</span>() &#123;</span>
              </div>
              <div className="flex items-center gap-2 pl-3">
                <span className="text-slate-600 select-none text-[9px]">3</span>
                <span><span className="text-blue-400 font-bold">const</span> &#123; <span className="text-amber-300">coffee</span>, <span className="text-cyan-300">focus</span> &#125; = <span className="text-indigo-400">useDeveloper</span>();</span>
              </div>
              <div className="flex items-center gap-2 pl-3">
                <span className="text-slate-600 select-none text-[9px]">4</span>
                <span><span className="text-pink-400 font-bold">return</span> &lt;<span className="text-sky-400 font-bold">CozyWorkspace</span> <span className="text-amber-300">level</span>=&#123;<span className="text-emerald-400">100</span>&#125; /&gt;;</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 select-none text-[9px]">5</span>
                <span>&#125;</span>
              </div>

              {isScreenFlickering && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-scanline pointer-events-none" />
              )}
            </div>

            <div className="bg-slate-900 px-3 py-1 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">✓ Ready</span>
              <span>TypeScript React</span>
              <span className="text-cyan-400">LN 5, COL 2</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-6 h-6 sm:h-8 bg-slate-700 border-x-2 border-slate-600 shadow-md" />
            <div className="w-24 sm:w-32 h-2.5 bg-slate-800 border-2 border-slate-600 rounded-md shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 w-full bg-[#1e293b] border-t-4 border-x-4 border-slate-600/90 rounded-t-xl shadow-2xl p-2 sm:p-3 flex items-center justify-between min-h-[58px] sm:min-h-[68px]">
          <div className="flex items-center gap-3 sm:gap-6 pl-2 sm:pl-4">
            <div
              onClick={onMugClick}
              className={`pointer-events-auto cursor-pointer relative flex flex-col items-center transition-transform ${
                isMugSipping ? "animate-mug-sip" : "hover:scale-105 active:scale-95"
              }`}
            >
              <div className="w-10 sm:w-12 h-2 bg-slate-950/80 rounded-full mb-[-2px] opacity-80" />

              {drink === "hot_coffee" && (
                <div className="relative flex flex-col items-center">
                  <CoffeeSteam className="absolute -top-7 left-0" active />
                  <div className="w-8 sm:w-9 h-9 sm:h-10 bg-amber-900 border-2 border-amber-600 rounded-b-xl rounded-t-sm shadow-md flex items-center justify-center relative">
                    <span className="text-xs">☕</span>
                    <div className="w-3 h-5 border-2 border-amber-600 rounded-r-lg absolute -right-3 top-2 bg-transparent" />
                  </div>
                </div>
              )}

              {drink === "boba_tea" && (
                <div className="relative flex flex-col items-center">
                  <div className="w-2.5 h-3 bg-slate-200/90 rounded-t-sm -mb-1" />
                  <div className="w-7 sm:w-8 h-10 sm:h-11 bg-emerald-950 border-2 border-emerald-500 rounded-b-xl rounded-t-sm shadow flex flex-col justify-between p-1">
                    <div className="text-[9px] text-center font-bold">🧋</div>
                    <div className="flex justify-around pb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    </div>
                  </div>
                </div>
              )}

              {drink === "energy_drink" && (
                <div className="relative flex flex-col items-center">
                  <div className="w-6 sm:w-7 h-10 sm:h-11 bg-gradient-to-b from-cyan-400 via-blue-600 to-indigo-950 border-2 border-cyan-300 rounded-lg shadow-md flex items-center justify-center">
                    <span className="text-xs font-black text-yellow-300">⚡</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <div className="text-base sm:text-lg">🪴</div>
              <div className="w-6 sm:w-7 h-5 sm:h-6 bg-amber-800 border-2 border-amber-600 rounded-b-lg rounded-t-xs shadow" />
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-slate-950/80 border-2 border-slate-700/80 rounded-xl px-3 sm:px-6 py-1.5 shadow-inner">
            {keyboard === "slate_compact" && (
              <div className="w-36 sm:w-48 h-6 sm:h-7 bg-slate-900 border-2 border-slate-700 rounded-lg shadow flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 rounded-xs bg-sky-500" />
                <div className="w-20 sm:w-28 h-3 bg-slate-800 rounded flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-600 rounded" />
                </div>
                <div className="w-2.5 h-2.5 rounded-xs bg-slate-700" />
              </div>
            )}

            {keyboard === "cyber_rgb" && (
              <div className="flex gap-2">
                <div className="w-16 sm:w-22 h-6 sm:h-7 bg-pink-950/80 border-2 border-pink-500 rounded-lg shadow-[0_0_8px_rgba(236,72,153,0.5)] flex items-center justify-center">
                  <div className="w-8 h-2 bg-pink-500/50 rounded" />
                </div>
                <div className="w-16 sm:w-22 h-6 sm:h-7 bg-cyan-950/80 border-2 border-cyan-500 rounded-lg shadow-[0_0_8px_rgba(6,182,212,0.5)] flex items-center justify-center">
                  <div className="w-8 h-2 bg-cyan-500/50 rounded" />
                </div>
              </div>
            )}

            {keyboard === "vintage_beige" && (
              <div className="w-36 sm:w-48 h-7 sm:h-8 bg-stone-200 border-2 border-stone-400 rounded-lg shadow flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 rounded-xs bg-rose-600" />
                <div className="w-20 sm:w-28 h-3 bg-stone-300 rounded flex items-center justify-center">
                  <div className="w-10 h-1 bg-stone-400 rounded" />
                </div>
                <div className="w-2.5 h-2.5 rounded-xs bg-stone-400" />
              </div>
            )}

            <div className="ml-3 sm:ml-4 w-4 sm:w-5 h-7 sm:h-8 bg-slate-800 border-2 border-slate-600 rounded-full shadow flex flex-col items-center justify-start pt-1">
              <div className="w-1.5 h-2 bg-sky-400 rounded-full" />
            </div>
          </div>

          <div className="w-16 sm:w-24" />
        </div>

        <div className="relative z-0 w-full h-4 bg-[#141c2b] border-x-4 border-b-4 border-slate-700 shadow-2xl" />

        <div className="w-full flex justify-between px-6 sm:px-12">
          <div className="w-5 sm:w-6 h-14 sm:h-20 bg-slate-800 border-x-2 border-b-2 border-slate-700 shadow-xl" />
          <div className="w-5 sm:w-6 h-14 sm:h-20 bg-slate-800 border-x-2 border-b-2 border-slate-700 shadow-xl" />
        </div>
      </div>
    </div>
  );
}
