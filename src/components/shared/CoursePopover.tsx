"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
            className="absolute top-14 sm:top-16 right-0 z-[70] w-[320px] bg-[#0c162c] border-2 border-b-4 border-slate-700 border-b-slate-800 rounded-3xl p-3 shadow-2xl flex flex-col origin-top-right"
          >
            <div className="flex flex-col gap-2">
              {COURSES.map((course) => {
                const isActive = activeCourse === course.id;
                const Icon = course.icon;
                
                return (
                  <div
                    key={course.id}
                    onClick={() => handleSwitch(course.id)}
                    className={`relative flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isActive 
                        ? "bg-slate-900 border-amber-400/80 shadow-md shadow-amber-500/10" 
                        : "bg-[#081020]/60 border-slate-800 hover:bg-slate-800/60 cursor-pointer active:scale-95"
                    }`}
                  >
                    <div className="shrink-0 flex items-center justify-center">
                      {course.iconSrc ? (
                        <img src={course.iconSrc} alt={course.title} className="w-14 h-14 object-contain" />
                      ) : (
                        <Icon className="w-10 h-10 text-amber-400" />
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end text-right">
                      <span className="font-black text-white text-lg tracking-wide">
                        {course.title}
                      </span>
                      <span className="text-sm font-bold text-amber-400 mt-0.5">
                        Lesson {Math.max(1, completedNodesCount + 1)}
                      </span>
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
