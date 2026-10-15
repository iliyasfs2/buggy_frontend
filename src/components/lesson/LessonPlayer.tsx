"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactElement,
} from "react";
import { useRouter } from "next/navigation";
import type { LessonContent, LessonStep, LessonUserInput } from "@/types/lesson";
import { getStepRenderer } from "./StepRegistry";
import { soundEffects } from "@/utils/soundEffects";
import { useGameStore, selectBattery } from "@/store/useGameStore";
import { useBatteryTimer } from "@/hooks/useBatteryTimer";
import { resolveMistakeApi, createMistakeApi } from "@/services/debugApi";
import { completeNode, type ProgressData } from "@/services/progressApi";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { useNavStore } from "@/store/useNavStore";
import { motion, AnimatePresence } from "framer-motion";
import { StatBadge } from "@/components/shared";
import {
  X,
  CheckCircle2,
  Zap,
  Flame,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";

export interface LessonPlayerProps {
  lesson: LessonContent;
  onComplete: (totalXp: number) => void;
  onExit: () => void;
  mode?: string;
  onResolveMistake?: (mistakeId: number) => Promise<void> | void;
}

function AnimatedXpCounter({ target }: { target: number }): ReactElement {
  const [count, setCount] = useState(0);
  const lastCount = useRef(0);

  useEffect(() => {
    let animationFrameId: number;
    const duration = 1200;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const newCount = Math.round(easeOutQuad * target);
      
      if (newCount > lastCount.current) {
        soundEffects.playClick();
        lastCount.current = newCount;
      }
      
      setCount(newCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target]);

  return <span>+{count} XP</span>;
}

function AnimatedStreakCard({
  streak,
  increased = false,
}: {
  streak: number;
  increased?: boolean;
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 border-b-4 border-slate-950 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-lg w-full">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          STREAK
        </span>
        {increased && (
          <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-1 rounded border border-amber-500/40">
            +1 🔥
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 transition-all duration-500">
        <Flame
          className={`w-5 h-5 transition-all duration-500 ${
            streak > 0
              ? "text-orange-400 fill-orange-400 drop-shadow-[0_0_14px_rgba(249,115,22,0.8)]"
              : "text-slate-400 fill-slate-400 grayscale opacity-40"
          }`}
        />
        <span className="text-xl font-black font-mono text-orange-400">
          {streak}
        </span>
      </div>
    </div>
  );
}

export function LessonPlayer({
  lesson,
  onComplete,
  onExit,
  mode = "",
  onResolveMistake,
}: LessonPlayerProps): ReactElement {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const isDebugSession = Boolean(mode && mode.startsWith("debug"));

  const router = useRouter();
  const batteryCount = useGameStore(selectBattery);
  const decreaseBattery = useGameStore((state) => state.decreaseBattery);
  const refillTimer = useBatteryTimer(30);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInput, setUserInput] = useState<LessonUserInput>(null);
  const [evaluationState, setEvaluationState] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [isShaking, setIsShaking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(0);
  const [streakCelebration, setStreakCelebration] = useState<{
    open: boolean;
    streak: number;
  } | null>(null);
  const [committedData, setCommittedData] = useState<ProgressData | null>(null);
  const committedRef = useRef(false);

  const streakCount = useGameStore((state) => state.streakCount);

  const steps = lesson.steps;
  const currentStep: LessonStep | undefined = steps[currentStepIndex];

  const progressPercent = useMemo(() => {
    if (steps.length === 0) return 0;
    if (
      isFinished ||
      (currentStepIndex === steps.length - 1 && evaluationState === "correct")
    ) {
      return 100;
    }
    return Math.round((currentStepIndex / steps.length) * 100);
  }, [currentStepIndex, steps.length, isFinished, evaluationState]);

  const handleUserInput = (val: LessonUserInput) => {
    if (evaluationState === "correct") return;
    setUserInput(val);
    soundEffects.playClick();
  };

  const hasInput = useMemo(() => {
    if (!currentStep) return false;
    if (currentStep.type === "theory") return true;
    if (
      currentStep.type === "single_choice" ||
      currentStep.type === "bug_hunt"
    ) {
      return (
        (typeof userInput === "string" && userInput.trim().length > 0) ||
        typeof userInput === "number"
      );
    }
    if (currentStep.type === "fill_blank") {
      return typeof userInput === "string" && userInput.trim().length > 0;
    }
    if (
      currentStep.type === "line_ordering" ||
      currentStep.type === "code_order"
    ) {
      return (
        Array.isArray(userInput) &&
        userInput.length >= currentStep.correctOrder.length
      );
    }
    return false;
  }, [currentStep, userInput]);

  const handleIncorrect = useCallback(() => {
    soundEffects.playIncorrect();
    setIsShaking(true);
    setMistakesCount((prev) => prev + 1);
    if (!isDebugSession) {
      decreaseBattery();
      if (currentStep) {
        let userAns = "";
        if (typeof userInput === "string") {
          userAns = userInput;
        } else if (
          typeof userInput === "number" &&
          "options" in currentStep &&
          currentStep.options
        ) {
          userAns = currentStep.options[userInput] || String(userInput);
        } else if (
          Array.isArray(userInput) &&
          "lines" in currentStep &&
          currentStep.lines
        ) {
          userAns = userInput.map((i) => currentStep.lines[i]).join(" ");
        } else if (userInput !== null && userInput !== undefined) {
          userAns = String(userInput);
        }

        let correctAns = "";
        if ("correctAnswer" in currentStep && currentStep.correctAnswer) {
          correctAns = currentStep.correctAnswer;
        } else if (
          "correctIndex" in currentStep &&
          typeof currentStep.correctIndex === "number" &&
          "options" in currentStep &&
          currentStep.options
        ) {
          correctAns = currentStep.options[currentStep.correctIndex] || "";
        } else if (
          "correctOrder" in currentStep &&
          currentStep.correctOrder &&
          "lines" in currentStep &&
          currentStep.lines
        ) {
          correctAns = currentStep.correctOrder
            .map((i) => currentStep.lines[i])
            .join(" ");
        }

        const snippet =
          ("codeSnippet" in currentStep && currentStep.codeSnippet) ||
          ("codeTemplate" in currentStep && currentStep.codeTemplate) ||
          ("lines" in currentStep && currentStep.lines
            ? currentStep.lines.join("\n")
            : "");

        const qTitle =
          currentStep.title ||
          ("question" in currentStep && currentStep.question) ||
          ("instruction" in currentStep && currentStep.instruction) ||
          "Lesson Challenge";

        createMistakeApi({
          node_id: lesson.nodeId,
          lesson_title: lesson.title,
          question_title: qTitle,
          code_snippet: snippet,
          user_answer: userAns,
          correct_answer: correctAns,
          explanation:
            currentStep.explanation || "Review the correct solution above.",
        })
          .then(() => {
            const currentMistakes = useGameStore.getState().mistakesCount;
            useGameStore.getState().setMistakesCount(currentMistakes + 1);
          })
          .catch(() => {});
      }
    }
    setEvaluationState("incorrect");
    setTimeout(() => setIsShaking(false), 400);
  }, [decreaseBattery, isDebugSession, currentStep, userInput, lesson]);

  const handleCorrect = useCallback(async () => {
    soundEffects.playCorrect();
    setEvaluationState("correct");

    if (mode === "debug_mistakes" && currentStep?.mistakeId) {
      if (onResolveMistake) {
        await onResolveMistake(currentStep.mistakeId);
      } else {
        try {
          const res = await resolveMistakeApi(currentStep.mistakeId);
          useGameStore.getState().setMistakesCount(res.remaining_count);
          useGameStore.getState().addXp(10);
        } catch {}
      }
    } else if (mode === "debug_tracing") {
      useGameStore
        .getState()
        .setByteBalance(useGameStore.getState().byteBalance + 5);
    }
  }, [mode, currentStep, onResolveMistake]);

  const handleCheck = useCallback(() => {
    if (!currentStep || !hasInput) return;

    if (currentStep.type === "theory") {
      handleCorrect();
      return;
    }

    if (currentStep.type === "single_choice") {
      const isRight =
        typeof userInput === "string"
          ? userInput.trim().toLowerCase() ===
            currentStep.correctAnswer.trim().toLowerCase()
          : typeof currentStep.correctIndex === "number" &&
            userInput === currentStep.correctIndex;
      if (isRight) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
      return;
    }

    if (currentStep.type === "fill_blank") {
      const clean = typeof userInput === "string" ? userInput.trim() : "";
      const isRight =
        clean.toLowerCase() ===
          currentStep.correctAnswer.trim().toLowerCase() ||
        (currentStep.acceptedAnswers &&
          currentStep.acceptedAnswers.some(
            (ans) => ans.trim().toLowerCase() === clean.toLowerCase(),
          ));
      if (isRight) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
      return;
    }

    if (
      currentStep.type === "line_ordering" ||
      currentStep.type === "code_order"
    ) {
      const isRight =
        Array.isArray(userInput) &&
        userInput.length === currentStep.correctOrder.length &&
        userInput.every((val, idx) => val === currentStep.correctOrder[idx]);
      if (isRight) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
      return;
    }

    if (currentStep.type === "bug_hunt") {
      const isRight =
        typeof userInput === "string" && currentStep.correctAnswer
          ? userInput.trim().toLowerCase() ===
            currentStep.correctAnswer.trim().toLowerCase()
          : typeof currentStep.correctIndex === "number"
            ? userInput === currentStep.correctIndex
            : userInput === currentStep.buggyLineIndex;
      if (isRight) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
      return;
    }
  }, [currentStep, hasInput, userInput, handleCorrect, handleIncorrect]);

  const handleNextStep = useCallback(() => {
    if (evaluationState === "incorrect") {
      setEvaluationState("idle");
      setUserInput(null);
      return;
    }

    if (currentStepIndex + 1 < steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setUserInput(null);
      setEvaluationState("idle");
    } else {
      soundEffects.playVictory();
      setTotalDurationSeconds(
        Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
      );
      setIsFinished(true);
    }
  }, [currentStepIndex, evaluationState, steps.length]);

  const isPerfectRun = mistakesCount === 0;
  const baseRewardXp = lesson.totalXp || 20;
  const earnedXP = isPerfectRun ? baseRewardXp + 5 : baseRewardXp;
  const earnedBytes =
    mode === "debug_stories"
      ? 30
      : mode === "debug_tracing"
      ? 5
      : mode === "debug_refactor"
      ? 20
      : isPerfectRun
      ? 15
      : 10;
  const accuracyPercentage = Math.round(
    Math.max(0, ((steps.length - mistakesCount) / steps.length) * 100)
  );

  useEffect(() => {
    if (!isFinished || committedRef.current) return;
    committedRef.current = true;

    let nextNodeId: string | null = null;
    if (!isDebugSession) {
      nextNodeId = useRoadmapStore.getState().completeNode(lesson.nodeId);
    }

    completeNode({
      nodeId: lesson.nodeId,
      earnedXp: earnedXP,
      earnedBytes,
      nextNodeId,
      flawless: isPerfectRun,
      mode: mode || undefined,
    })
      .then((data) => {
        setCommittedData(data);
        useNavStore.getState().syncNav(data);
        useRoadmapStore.getState().syncProgress(data);
        if (data.streak_increased) {
          soundEffects.playVictory();
          setStreakCelebration({ open: true, streak: data.streak });
        }
      })
      .catch(() => {});
  }, [
    isFinished,
    isDebugSession,
    lesson.nodeId,
    earnedXP,
    earnedBytes,
    isPerfectRun,
    mode,
  ]);

  if (isFinished) {
    const minutes = Math.floor(totalDurationSeconds / 60);
    const seconds = totalDurationSeconds % 60;
    const timeFormatted = `${minutes}:${String(seconds).padStart(2, "0")}`;

    return (
      <div className="fixed inset-0 z-[100] bg-[#101826] flex flex-col items-center justify-between p-6 sm:p-8 animate-in fade-in zoom-in-95 select-none overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full gap-4 my-auto">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-sky-500/25 blur-3xl rounded-full scale-125 pointer-events-none" />
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
              <img
                src="/images/buggy-victory.png"
                alt="Victory Mascot"
                className="w-full h-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)] animate-bounce"
              />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
            {isDebugSession ? "Practice Session Completed!" : "Lesson Completed!"}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {isPerfectRun && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                PERFECT RUN (+5 BONUS XP)
              </div>
            )}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeFormatted}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full my-4">
            <div className="bg-slate-900/80 border border-slate-800 border-b-4 border-slate-950 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                TOTAL XP
              </span>
              <span className="text-sky-400 text-xl font-black font-mono">
                <AnimatedXpCounter target={earnedXP} />
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 border-b-4 border-slate-950 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                BYTES
              </span>
              <span className="text-amber-400 text-xl font-black font-mono">
                +{earnedBytes}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 border-b-4 border-slate-950 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                ACCURACY
              </span>
              <span className="text-emerald-400 text-xl font-black font-mono">
                {accuracyPercentage}%
              </span>
            </div>

            <AnimatedStreakCard
              streak={committedData?.streak ?? streakCount}
              increased={Boolean(committedData?.streak_increased)}
            />
          </div>
        </div>

        <div className="w-full max-w-lg mt-4 shrink-0">
          <button
            type="button"
            onClick={() => onComplete(earnedXP)}
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-[0px] text-white font-black text-lg select-none transition-all cursor-pointer shadow-lg"
          >
            {isDebugSession ? "RETURN TO DEBUG" : "CONTINUE TO ROADMAP"}
          </button>
        </div>

        <AnimatePresence>
          {streakCelebration?.open && (
            <div className="fixed inset-0 z-[150] bg-[#0f172a]/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-orange-500/40 p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent pointer-events-none" />

                <div className="w-24 h-24 rounded-3xl bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center relative shadow-inner">
                  <Flame className="w-14 h-14 text-orange-400 fill-orange-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.9)] animate-pulse" />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg border border-orange-300">
                    +1 🔥
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 z-10">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {streakCelebration.streak} Day Streak!
                  </h3>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-xs">
                    Today&apos;s streak is officially secured! Practice again tomorrow to keep your flame burning.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setStreakCelebration(null);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 active:translate-y-1 border-b-4 border-orange-700 active:border-b-0 text-slate-950 font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg z-10"
                >
                  Continue
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const ActiveRenderer = currentStep ? getStepRenderer(currentStep.type) : null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#101826] text-slate-100 flex flex-col select-none overflow-hidden">
      <header className="w-full shrink-0 pt-4 sm:pt-5 pb-2">
        <div className="w-full max-w-xl mx-auto px-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit lesson"
            className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_12px_rgba(52,211,153,0.5)]"
              style={{ width: `${Math.max(progressPercent, 5)}%` }}
            />
          </div>

          {isDebugSession ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>DEBUG MODE</span>
            </div>
          ) : (
            <div
              className={`transition-all duration-300 ${
                isShaking
                  ? "animate-shake scale-110 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)] grayscale-[0.5] hue-rotate-[-30deg]"
                  : ""
              }`}
            >
              <StatBadge variant="battery" value={batteryCount} compact />
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full flex flex-col justify-start overflow-hidden">
        <div className="w-full max-w-xl mx-auto px-4 pt-4 sm:pt-10 pb-4 flex flex-col h-full">
          <div
            className={`w-full flex flex-col ${isShaking ? "animate-shake" : ""}`}
          >
            {ActiveRenderer && currentStep && (
              <ActiveRenderer
                key={currentStep.id}
                step={currentStep}
                value={userInput}
                onChange={handleUserInput}
                isSubmitted={evaluationState !== "idle"}
                isCorrect={evaluationState === "correct"}
                isShaking={isShaking}
              />
            )}
          </div>
        </div>
      </main>

      {evaluationState === "incorrect" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-rose-950/95 border-t-2 border-rose-500/40 backdrop-blur-md px-6 py-5 flex items-center animate-in slide-in-from-bottom-full duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-500/20 animate-in zoom-in duration-500">
                <X className="w-7 h-7 stroke-[3]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-xl sm:text-2xl font-black text-rose-400">
                  {isDebugSession ? "Not quite right!" : "Incorrect"}
                </h4>
                {currentStep?.explanation && (
                  <p className="text-xs sm:text-sm font-semibold text-rose-200/90 line-clamp-2 mt-0.5 max-w-md">
                    {currentStep.explanation}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 text-white font-black rounded-2xl px-8 py-4 active:translate-y-1 active:border-b-[0px] transition-all cursor-pointer shadow-lg shrink-0"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {evaluationState === "correct" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-950/90 border-t-2 border-emerald-500/40 backdrop-blur-md px-6 py-5 flex items-center animate-in slide-in-from-bottom-full duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-7 h-7 stroke-[3]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-xl sm:text-2xl font-black text-emerald-400">
                  {mode === "debug_tracing"
                    ? "Output Matched! +5 Bytes"
                    : mode === "debug_refactor"
                    ? "Clean & Modern Code!"
                    : mode === "debug_mistakes"
                    ? "Bug Resolved! +10 XP"
                    : "Nicely done!"}
                </h4>
                {currentStep?.explanation && mode === "debug_refactor" && (
                  <p className="text-xs sm:text-sm font-semibold text-emerald-200/90 line-clamp-2 mt-0.5 max-w-md">
                    {currentStep.explanation}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 text-slate-950 font-black rounded-2xl px-8 py-4 active:translate-y-1 active:border-b-[0px] transition-all cursor-pointer shadow-lg shrink-0"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <footer className="w-full shrink-0 bg-[#101826] border-t border-slate-800 py-4 relative z-40">
        <div className="w-full max-w-xl mx-auto px-4 flex items-center justify-end">
          <button
            type="button"
            disabled={!hasInput}
            onClick={handleCheck}
            className={`px-8 py-4 rounded-2xl font-black text-[15px] uppercase tracking-wider transition-all duration-200 ${
              hasInput
                ? "bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-[0px] text-white cursor-pointer shadow-lg"
                : "bg-slate-800 border-b-4 border-slate-900 text-slate-500 cursor-not-allowed"
            }`}
          >
            Check
          </button>
        </div>
      </footer>

      {!isDebugSession && batteryCount === 0 && (
        <div className="fixed inset-0 z-[60] bg-[#101826]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-5">
              <Zap className="w-10 h-10 text-rose-500 fill-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">Out of Energy!</h2>
            <p className="text-slate-400 font-medium mb-4 text-sm">
              You&apos;ve made too many mistakes and ran out of energy. Recharge to try again!
            </p>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-4 py-2 rounded-2xl mb-6 shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Refill in:</span>
              <span className="text-base font-black font-mono tracking-widest">{refillTimer}</span>
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                type="button"
                onClick={() => {
                  onExit();
                  router.push("/store");
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:translate-y-1 border-b-4 border-amber-700 text-slate-950 font-black text-[14px] uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Instant Refill in Store
              </button>
              <button
                type="button"
                onClick={onExit}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-4 border-slate-950 text-slate-300 font-black text-[14px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Back to Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
