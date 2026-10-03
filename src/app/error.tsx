"use client";

import type { ReactElement } from "react";
import { useEffect } from "react";

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps): ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#101826] text-slate-100">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl mb-4 text-rose-400">
        ⚠️
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
        Something went wrong!
      </h2>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {error.message || "An unexpected error occurred during execution. Try refreshing or resetting the workspace state."}
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
