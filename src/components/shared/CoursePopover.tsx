"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { switchCourseApi } from "@/services/progressApi";
import { useNavStore } from "@/store/useNavStore";
import { COURSES } from "@/constants/courses";

export interface CoursePopoverProps {
  activeCourse: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CoursePopover({ activeCourse, isOpen, onClose }: CoursePopoverProps) {
  const switchCourse = useNavStore((state) => state.switchCourse);
  const completedNodesCount = useNavStore((state) => state.completedNodesCount);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSwitch = async (courseId: string) => {
    if (courseId === activeCourse) return;
    setLoadingId(courseId);
    try {
      await switchCourseApi(courseId);
      switchCourse(courseId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-transparent" onClick={onClose} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-14 sm:top-16 right-0 z-[70] w-[300px] bg-[#0c162c] border-2 border-b-4 border-slate-700 border-b-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col origin-top-right"
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Your Courses</h3>
            
            <div className="flex flex-col gap-2">
              {COURSES.map((course) => {
                const isActive = activeCourse === course.id;
                const Icon = course.icon;
                const totalNodes = course.chapters.reduce((sum, ch) => sum + (ch.nodes?.length || 0), 0);
                const progress = totalNodes > 0 ? Math.min(100, Math.round((completedNodesCount / totalNodes) * 100)) : 0;
                
                return (
                  <div
                    key={course.id}
                    onClick={() => handleSwitch(course.id)}
                    className={`relative flex items-center p-3 rounded-2xl border transition-all ${
                      isActive 
                        ? "bg-slate-900 border-amber-400/80 shadow-md shadow-amber-500/10" 
                        : "bg-[#081020]/60 border-slate-800 hover:bg-slate-800/60 cursor-pointer active:scale-95"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-3 text-amber-400 bg-amber-400/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100 truncate pr-2">{course.title}</span>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{progress}%</span>
                      </div>
                    </div>
                    
                    {loadingId === course.id && (
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                        <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
