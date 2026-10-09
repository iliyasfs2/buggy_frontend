"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Code2, Terminal, Plus, CheckCircle2 } from "lucide-react";
import { switchCourseApi } from "@/services/progressApi";
import { useNavStore } from "@/store/useNavStore";

export interface CoursePopoverProps {
  activeCourse: string;
  isOpen: boolean;
  onClose: () => void;
}

const COURSES = [
  { id: "javascript", title: "JavaScript", icon: Code2, color: "text-amber-400 bg-amber-400/10", progress: 45, locked: false },
  { id: "python", title: "Python", icon: Terminal, color: "text-sky-400 bg-sky-400/10", progress: 0, locked: false },
  { id: "react", title: "React", icon: Code2, color: "text-indigo-400 bg-indigo-400/10", progress: 0, locked: true },
];

export function CoursePopover({ activeCourse, isOpen, onClose }: CoursePopoverProps) {
  const switchCourse = useNavStore((state) => state.switchCourse);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSwitch = async (courseId: string, locked: boolean) => {
    if (locked || courseId === activeCourse) return;
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
            className="absolute top-14 sm:top-16 right-0 z-[70] w-[300px] bg-slate-900 border border-slate-700/60 border-b-4 border-slate-950 rounded-3xl p-4 shadow-[0_15px_40px_-10px_rgba(251,191,36,0.15)] flex flex-col origin-top-right"
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Your Courses</h3>
            
            <div className="flex flex-col gap-2 mb-4">
              {COURSES.map((course) => {
                const isActive = activeCourse === course.id;
                const Icon = course.icon;
                
                return (
                  <div
                    key={course.id}
                    onClick={() => handleSwitch(course.id, course.locked)}
                    className={`relative flex items-center p-3 rounded-2xl border transition-all ${
                      isActive 
                        ? "bg-slate-800 border-slate-600 shadow-sm" 
                        : course.locked
                          ? "bg-slate-900/50 border-slate-800/50 opacity-50 cursor-not-allowed"
                          : "bg-slate-900 border-slate-800 hover:bg-slate-800 cursor-pointer active:scale-95"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-3 ${course.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100 truncate pr-2">{course.title}</span>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {course.locked && <Lock className="w-4 h-4 text-slate-500 shrink-0" />}
                      </div>
                      
                      {!course.locked && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{course.progress}%</span>
                        </div>
                      )}
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

            <button className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all font-bold text-sm flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Course
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
