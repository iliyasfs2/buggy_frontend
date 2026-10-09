"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useNavStore, selectByteBalance } from "@/store/useNavStore";

export default function BytesPage() {
  const router = useRouter();
  const byteBalance = useNavStore(selectByteBalance);

  return (
    <div className="min-h-screen bg-[#0a111a] flex flex-col relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />

            <header className="flex items-center justify-between p-6 relative z-10">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Wallet</h1>
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </header>

            <main className="flex-1 flex flex-col px-6 pt-6 pb-12 relative z-10 max-w-md mx-auto w-full">
        
                <div className="flex flex-col items-center mb-12 mt-4">
          <motion.div 
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-40 h-40 rounded-full flex items-center justify-center mb-6 relative drop-shadow-[0_0_60px_rgba(56,189,248,0.3)]"
          >
                        <img 
              src="/icons/byte.png" 
              alt="Byte Coin" 
              className="w-full h-full object-contain relative z-10 drop-shadow-2xl" 
            />
            
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 right-4 w-3 h-3 bg-sky-300 rounded-full blur-[2px]" />
              <div className="absolute bottom-4 left-4 w-4 h-4 bg-sky-400 rounded-full blur-[3px]" />
            </motion.div>
          </motion.div>
          
          <h2 className="text-6xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">
            {byteBalance.toLocaleString()}
          </h2>
          <p className="text-sky-400 font-black tracking-widest uppercase text-sm">Total Bytes</p>
        </div>

                <div className="mt-auto">
          <button
            onClick={() => router.push("/store")}
            className="w-full py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 active:translate-y-1 border-b-4 border-blue-700 active:border-b-0 text-white shadow-[0_10px_20px_-10px_rgba(14,165,233,0.5)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l.17-.25z"/>
            </svg>
            Open Store
          </button>
        </div>
      </main>
    </div>
  );
}
