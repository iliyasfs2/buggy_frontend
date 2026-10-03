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
  const getMonitorColor = (): string => {
    switch (monitor) {
      case "dual_curved":
        return "#818cf8";
      case "cyber_hologram":
        return "#f43f5e";
      case "retro_crt":
        return "#22c55e";
      default:
        return "#38bdf8";
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-16 flex flex-col justify-end items-center pointer-events-none select-none">
      <div className="relative w-full max-w-2xl px-4 flex flex-col items-center">
        <div className="relative z-10 flex items-end justify-center mb-[-6px]">
          <MonitorGlow color={getMonitorColor()} isFlickering={isScreenFlickering} />

          {monitor === "laptop_standard" && (
            <div
              onClick={onScreenClick}
              className={`pointer-events-auto cursor-pointer relative w-56 sm:w-64 h-36 sm:h-40 bg-slate-900 border-2 border-slate-700 rounded-t-xl shadow-2xl p-2 flex flex-col justify-between overflow-hidden transition-all duration-150 active:scale-[0.98] ${
                isScreenFlickering ? "brightness-125 border-cyan-400 ring-2 ring-cyan-500/40" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[9px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  buggy.tsx
                </div>
                <div className="text-[8px] font-mono text-slate-500">READY</div>
              </div>

              <div className="flex-1 font-mono text-[9px] sm:text-[10px] text-slate-300 py-1 flex flex-col justify-around relative overflow-hidden">
                <div className="flex gap-2">
                  <span className="text-slate-600 select-none">01</span>
                  <span><span className="text-pink-400">export</span> <span className="text-blue-400">const</span> <span className="text-amber-300">buggyOS</span> = () =&gt; &#123;</span>
                </div>
                <div className="flex gap-2 pl-3">
                  <span className="text-slate-600 select-none">02</span>
                  <span><span className="text-cyan-400">useSandbox</span>(&#123; <span className="text-emerald-400">fps: 60</span> &#125;);</span>
                </div>
                <div className="flex gap-2 pl-3">
                  <span className="text-slate-600 select-none">03</span>
                  <span className="text-slate-400">return &lt;<span className="text-yellow-400">BugVault</span> live /&gt;;</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-600 select-none">04</span>
                  <span>&#125;;</span>
                </div>

                {isScreenFlickering && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-scanline pointer-events-none" />
                )}
              </div>

              <div className="w-full bg-slate-950/80 rounded px-2 py-0.5 flex items-center justify-between text-[8px] font-mono text-slate-400 border border-slate-800">
                <span className="text-emerald-400">⚡ 0 ERRORS</span>
                <span>UTF-8</span>
                <span className="text-cyan-400">CLICK TO HACK</span>
              </div>
            </div>
          )}

          {monitor === "dual_curved" && (
            <div
              onClick={onScreenClick}
              className={`pointer-events-auto cursor-pointer relative flex gap-1 transition-all duration-150 active:scale-[0.98] ${
                isScreenFlickering ? "brightness-125" : ""
              }`}
            >
              <div className="w-36 sm:w-44 h-36 sm:h-40 bg-slate-900 border-2 border-indigo-500/80 rounded-tl-xl p-2 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="text-[8px] font-mono text-indigo-300 font-bold border-b border-slate-800 pb-1 flex justify-between">
                  <span>TERMINAL 1</span>
                  <span className="text-emerald-400">CONNECTED</span>
                </div>
                <div className="font-mono text-[8px] text-slate-300 space-y-1">
                  <div className="text-emerald-400">$ vitest run --watch</div>
                  <div className="text-cyan-300">✓ 42 tests passed</div>
                  <div className="text-indigo-400">$ docker-compose up</div>
                  <div className="text-slate-400">Listening :8000</div>
                </div>
                <div className="text-[7px] font-mono text-indigo-400">PORT 8000 (DEV)</div>
              </div>

              <div className="w-36 sm:w-44 h-36 sm:h-40 bg-slate-900 border-2 border-indigo-500/80 rounded-tr-xl p-2 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="text-[8px] font-mono text-indigo-300 font-bold border-b border-slate-800 pb-1 flex justify-between">
                  <span>TELEMETRY 2</span>
                  <span className="text-cyan-400">LIVE</span>
                </div>
                <div className="font-mono text-[8px] text-cyan-300 space-y-1">
                  <div className="text-pink-400">&gt; AST Analyzer</div>
                  <div className="text-amber-300">Heap: 24.8 MB</div>
                  <div className="text-emerald-400">FPS: 60.0</div>
                </div>
                <div className="text-[7px] font-mono text-indigo-400">ULTRAWIDE DUAL</div>
              </div>
            </div>
          )}

          {monitor === "cyber_hologram" && (
            <div
              onClick={onScreenClick}
              className={`pointer-events-auto cursor-pointer relative w-60 sm:w-72 h-36 sm:h-40 bg-rose-950/20 border-2 border-rose-500/80 rounded-xl backdrop-blur-sm p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all duration-150 active:scale-[0.98] ${
                isScreenFlickering ? "brightness-150" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-rose-500/40 pb-1">
                <span className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-widest animate-pulse">
                  ◆ HOLOGRAM HUD
                </span>
                <span className="text-[8px] font-mono text-rose-300">CYBER_SYS_01</span>
              </div>
              <div className="flex-1 flex items-center justify-around font-mono text-[9px] text-rose-200">
                <div className="w-16 h-16 rounded-full border border-dashed border-rose-400/80 flex items-center justify-center animate-spin">
                  <div className="w-8 h-8 rounded-full border border-rose-300" />
                </div>
                <div className="space-y-1">
                  <div className="text-rose-400 font-bold">AST NODES: 8,400</div>
                  <div className="text-amber-300">GPU SHADER: OK</div>
                  <div className="text-cyan-300">SYNC: OPTIMAL</div>
                </div>
              </div>
              <div className="text-[8px] font-mono text-rose-400/80 text-center uppercase tracking-widest">
                [ NEURAL COMPILER ACTIVE ]
              </div>
            </div>
          )}

          {monitor === "retro_crt" && (
            <div
              onClick={onScreenClick}
              className={`pointer-events-auto cursor-pointer relative w-56 sm:w-64 h-36 sm:h-40 bg-slate-900 border-4 border-slate-700 rounded-3xl p-3 flex flex-col justify-between shadow-2xl transition-all duration-150 active:scale-[0.98] ${
                isScreenFlickering ? "brightness-125" : ""
              }`}
            >
              <div className="flex-1 bg-black rounded-2xl p-2 font-mono text-[9px] sm:text-[10px] text-emerald-400 flex flex-col justify-between border border-emerald-900/60 shadow-[inset_0_0_12px_rgba(34,197,94,0.3)]">
                <div>
                  <div className="text-emerald-500 font-bold">MS-DOS 6.22 BUGGY_OS</div>
                  <div className="text-emerald-300 mt-1">C:\&gt; BUGGY.EXE --DEBUG</div>
                  <div className="text-emerald-400 text-[8px] mt-0.5">MEMORY: 640K OK</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-3.5 bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] text-emerald-600">CRT 60Hz</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-0 w-full h-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-t-xl border-t-2 border-x-2 border-slate-700/80 shadow-2xl flex items-center justify-between px-6 sm:px-12">
          <div className="flex items-center gap-4 sm:gap-8">
            <div
              onClick={onMugClick}
              className={`pointer-events-auto cursor-pointer relative transition-transform ${
                isMugSipping ? "animate-mug-sip" : "hover:scale-110 active:scale-95"
              }`}
            >
              <div className="w-8 h-1.5 bg-slate-950/80 rounded-full mb-[-2px] mx-auto opacity-70" />

              {drink === "hot_coffee" && (
                <div className="relative flex flex-col items-center">
                  <CoffeeSteam className="absolute -top-7 left-0" active />
                  <div className="w-6 h-7 bg-amber-900 border border-amber-600/80 rounded-b-md rounded-t-sm shadow-md flex items-center justify-center">
                    <span className="text-[9px] font-bold text-amber-200">☕</span>
                    <div className="w-2 h-3 border-2 border-amber-700 rounded-r-full absolute -right-2 top-1.5" />
                  </div>
                </div>
              )}

              {drink === "boba_tea" && (
                <div className="relative flex flex-col items-center">
                  <div className="w-2.5 h-3 bg-slate-200/80 rounded-t-sm -mb-1" />
                  <div className="w-6 h-8 bg-emerald-900/90 border border-emerald-500/80 rounded-b-lg rounded-t-sm shadow flex flex-col justify-between p-0.5">
                    <div className="text-[7px] text-emerald-200 font-bold text-center">🧋</div>
                    <div className="flex justify-center gap-0.5 pb-0.5">
                      <div className="w-1 h-1 rounded-full bg-slate-900" />
                      <div className="w-1 h-1 rounded-full bg-slate-900" />
                      <div className="w-1 h-1 rounded-full bg-slate-900" />
                    </div>
                  </div>
                </div>
              )}

              {drink === "energy_drink" && (
                <div className="relative flex flex-col items-center">
                  <div className="w-5 h-8 bg-gradient-to-b from-cyan-400 via-blue-600 to-indigo-950 border border-cyan-300 rounded shadow flex items-center justify-center">
                    <span className="text-[8px] font-black text-yellow-300">⚡</span>
                  </div>
                </div>
              )}
            </div>

            <div className="w-5 h-6 bg-emerald-950 border border-emerald-600/50 rounded-b-md rounded-t-sm shadow flex items-center justify-center">
              <span className="text-[10px]">🪴</span>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            {keyboard === "slate_compact" && (
              <div className="w-36 sm:w-48 h-5 bg-slate-900 border border-slate-700 rounded-md shadow-md flex items-center justify-between px-1.5">
                <div className="w-2 h-2 rounded-xs bg-slate-700" />
                <div className="flex-1 flex justify-center gap-1 px-1">
                  <div className="w-20 sm:w-28 h-2.5 bg-slate-800 rounded flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-600 rounded" />
                  </div>
                </div>
                <div className="w-2 h-2 rounded-xs bg-blue-500" />
              </div>
            )}

            {keyboard === "cyber_rgb" && (
              <div className="flex gap-2">
                <div className="w-16 sm:w-20 h-5 bg-pink-950/60 border border-pink-500/80 rounded-md shadow-[0_0_8px_rgba(236,72,153,0.5)] flex items-center justify-center">
                  <div className="w-10 h-2 bg-pink-500/40 rounded" />
                </div>
                <div className="w-16 sm:w-20 h-5 bg-cyan-950/60 border border-cyan-500/80 rounded-md shadow-[0_0_8px_rgba(6,182,212,0.5)] flex items-center justify-center">
                  <div className="w-10 h-2 bg-cyan-500/40 rounded" />
                </div>
              </div>
            )}

            {keyboard === "vintage_beige" && (
              <div className="w-36 sm:w-48 h-6 bg-stone-200 border-2 border-stone-400 rounded-md shadow-md flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 rounded-xs bg-rose-600" />
                <div className="flex-1 flex justify-center gap-1">
                  <div className="w-20 h-3 bg-stone-300 rounded flex items-center justify-center">
                    <div className="w-10 h-1 bg-stone-400 rounded" />
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-xs bg-stone-400" />
              </div>
            )}
          </div>

          <div className="w-4 h-8 flex flex-col items-center justify-end">
            <div className="w-2 h-6 bg-slate-700 rounded-t-full border border-slate-600" />
            <div className="w-4 h-1.5 bg-amber-400/80 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          </div>
        </div>

        <div className="relative z-0 w-full h-5 bg-[#0d1420] border-b-4 border-slate-950 shadow-2xl flex justify-between items-center px-8">
          <div className="w-2 h-1 bg-slate-800 rounded-full" />
          <div className="w-32 h-0.5 bg-cyan-500/30 rounded-full" />
          <div className="w-2 h-1 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}
