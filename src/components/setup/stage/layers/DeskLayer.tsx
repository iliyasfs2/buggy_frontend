import type { ReactElement } from "react";
import { CoffeeSteam } from "../effects/CoffeeSteam";
import { MonitorGlow } from "../effects/MonitorGlow";

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
  const getMonitorBorder = (): string => {
    switch (monitor) {
      case "cyber_hologram":
        return "border-pink-500/80 shadow-[0_0_15px_rgba(236,72,153,0.3)]";
      case "retro_crt":
        return "border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
      case "dual_curved":
        return "border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.3)]";
      default:
        return "border-slate-700";
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute left-[14%] bottom-0 w-4 sm:w-5 h-[18%] bg-slate-900 border-x border-slate-700 shadow-xl" />
      <div className="absolute right-[14%] bottom-0 w-4 sm:w-5 h-[18%] bg-slate-900 border-x border-slate-700 shadow-xl" />

      <div className="absolute bottom-[18%] left-[10%] w-[80%] h-6 bg-slate-800 rounded-lg shadow-2xl border-t border-slate-600 flex items-center justify-between px-6 z-10" />

      <div className="absolute bottom-[23%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div className="relative">
          <MonitorGlow isFlickering={isScreenFlickering} />
          <div
            onClick={onScreenClick}
            className={`pointer-events-auto cursor-pointer relative w-56 sm:w-72 md:w-80 h-32 sm:h-40 md:h-44 bg-slate-950 border-4 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-150 active:scale-[0.99] ${getMonitorBorder()} ${
              isScreenFlickering ? "brightness-125 border-cyan-400 ring-2 ring-cyan-400/40" : ""
            }`}
          >
            <div className="flex items-center justify-between bg-slate-900 px-3 py-1 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[9px] font-mono text-slate-300 font-semibold">App.tsx</span>
              <span className="text-[8px] font-mono text-slate-500">BUGGY</span>
            </div>

            <div className="flex-1 p-2.5 font-mono text-[9px] sm:text-[10px] text-slate-300 flex flex-col justify-around bg-[#0c121e]">
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">1</span>
                <span><span className="text-pink-400">import</span> &#123; <span className="text-cyan-300">useCode</span> &#125; <span className="text-pink-400">from</span> <span className="text-emerald-300">&quot;buggy&quot;</span>;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">2</span>
                <span><span className="text-pink-400">export default function</span> <span className="text-yellow-300">Setup</span>() &#123;</span>
              </div>
              <div className="flex gap-2 pl-3">
                <span className="text-slate-600 select-none">3</span>
                <span><span className="text-blue-400">const</span> &#123; <span className="text-amber-300">focus</span> &#125; = <span className="text-cyan-300">useCode</span>();</span>
              </div>
              <div className="flex gap-2 pl-3">
                <span className="text-slate-600 select-none">4</span>
                <span><span className="text-pink-400">return</span> &lt;<span className="text-sky-400">Battlestation</span> /&gt;;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">5</span>
                <span>&#125;</span>
              </div>

              {isScreenFlickering && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-scanline pointer-events-none" />
              )}
            </div>

            <div className="bg-slate-900 px-3 py-0.5 flex items-center justify-between text-[8px] font-mono text-slate-400 border-t border-slate-800">
              <span className="text-emerald-400">● Live 60fps</span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>

        <div className="w-5 h-5 bg-slate-700 border-x border-slate-600" />
        <div className="w-20 sm:w-24 h-2 bg-slate-800 border border-slate-600 rounded-sm shadow-md" />
      </div>

      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
        {keyboard === "slate_compact" && (
          <div className="w-32 sm:w-40 h-5 bg-slate-900 border border-slate-700 rounded-md shadow-lg flex items-center justify-between px-1.5">
            <div className="w-2 h-2 rounded-xs bg-sky-500" />
            <div className="w-16 sm:w-22 h-2 bg-slate-800 rounded" />
            <div className="w-2 h-2 rounded-xs bg-slate-700" />
          </div>
        )}

        {keyboard === "cyber_rgb" && (
          <div className="flex gap-1.5">
            <div className="w-14 sm:w-18 h-5 bg-pink-950/80 border border-pink-500 rounded-md shadow-[0_0_6px_rgba(236,72,153,0.5)] flex items-center justify-center">
              <div className="w-6 h-1.5 bg-pink-500/50 rounded" />
            </div>
            <div className="w-14 sm:w-18 h-5 bg-cyan-950/80 border border-cyan-500 rounded-md shadow-[0_0_6px_rgba(6,182,212,0.5)] flex items-center justify-center">
              <div className="w-6 h-1.5 bg-cyan-500/50 rounded" />
            </div>
          </div>
        )}

        {keyboard === "vintage_beige" && (
          <div className="w-32 sm:w-40 h-5.5 bg-stone-200 border border-stone-400 rounded-md shadow-lg flex items-center justify-between px-1.5">
            <div className="w-2 h-2 rounded-xs bg-rose-600" />
            <div className="w-16 sm:w-22 h-2.5 bg-stone-300 rounded" />
            <div className="w-2 h-2 rounded-xs bg-stone-400" />
          </div>
        )}
      </div>

      <div className="absolute bottom-[20%] left-[18%] z-20">
        <div
          onClick={onMugClick}
          className={`pointer-events-auto cursor-pointer relative flex flex-col items-center transition-transform ${
            isMugSipping ? "animate-mug-sip" : "hover:scale-110 active:scale-95"
          }`}
        >
          {drink === "hot_coffee" && (
            <div className="relative flex flex-col items-center">
              <CoffeeSteam className="absolute -top-6 left-0" active />
              <div className="w-7 h-8 bg-amber-900 border border-amber-600 rounded-b-lg rounded-t-xs shadow-md flex items-center justify-center relative">
                <span className="text-[10px]">☕</span>
                <div className="w-2.5 h-4 border-2 border-amber-600 rounded-r-md absolute -right-2 top-1.5 bg-transparent" />
              </div>
            </div>
          )}

          {drink === "boba_tea" && (
            <div className="relative flex flex-col items-center">
              <div className="w-2 h-2.5 bg-slate-200/90 rounded-t-xs -mb-1" />
              <div className="w-6 h-9 bg-emerald-950 border border-emerald-500 rounded-b-lg rounded-t-xs shadow flex flex-col justify-between p-0.5">
                <div className="text-[8px] text-center font-bold">🧋</div>
                <div className="flex justify-around pb-0.5">
                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                  <div className="w-1 h-1 rounded-full bg-slate-900" />
                </div>
              </div>
            </div>
          )}

          {drink === "energy_drink" && (
            <div className="relative flex flex-col items-center">
              <div className="w-5 h-9 bg-gradient-to-b from-cyan-400 via-blue-600 to-indigo-950 border border-cyan-300 rounded-md shadow-md flex items-center justify-center">
                <span className="text-[10px] font-black text-yellow-300">⚡</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
