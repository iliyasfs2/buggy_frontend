"use client";

import type { ReactElement } from "react";
import { useEffect } from "react";

export interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps): ReactElement {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#101826] text-slate-100 flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl mb-4 text-rose-400">
          ⚠️
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Critical Application Error
        </h2>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          {error.message || "A critical error occurred. Please try reloading the workspace application."}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
        >
          Reload Workspace
        </button>
      </body>
    </html>
  );
}
