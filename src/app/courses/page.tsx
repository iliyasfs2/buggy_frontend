"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle2 } from "lucide-react";
import { useNavStore, selectActiveCourse, selectCompletedNodesCount } from "@/store/useNavStore";
import { switchCourseApi } from "@/services/progressApi";
import { COURSES } from "@/constants/courses";

export default function CoursesPage() {
  const router = useRouter();
  const activeCourse = useNavStore(selectActiveCourse);
  const completedNodesCount = useNavStore(selectCompletedNodesCount);
  const switchCourse = useNavStore((state) => state.switchCourse);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSwitch = async (courseId: string) => {
    if (courseId === activeCourse) return;
    setLoadingId(courseId);
    try {
      await switchCourseApi(courseId);
      switchCourse(courseId);
      router.push("/roadmap");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col relative overflow-hidden">
      <header className="flex items-center justify-between p-5 relative z-10">
        <h1 className="text-xl font-black text-slate-100">Select Course</h1>
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-4 pb-12 relative z-10 max-w-md mx-auto w-full gap-4">
        {COURSES.map((course) => {
          const isActive = activeCourse === course.id;
          const Icon = course.icon;
          const totalNodes = course.chapters.reduce((sum, ch) => sum + (ch.nodes?.length || 0), 0);
          const progress = totalNodes > 0 ? Math.min(100, Math.round((completedNodesCount / totalNodes) * 100)) : 0;
            
          return (
            <div 
              key={course.id}
              onClick={() => handleSwitch(course.id)}
              className={`relative overflow-hidden rounded-3xl border-2 p-5 transition-all ${
                isActive 
                  ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                  : "border-slate-700 bg-slate-800/80 hover:bg-slate-800 cursor-pointer active:scale-[0.98]"
              }`}
            >
              {isActive && (
                <div className="absolute top-4 right-4 text-emerald-500">
                  <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border text-amber-400 bg-amber-400/10 border-amber-500/30">
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-100">{course.title}</h3>
                  <p className="text-sm font-medium text-slate-400">
                    {`${progress}% Completed`}
                  </p>
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isActive ? "bg-emerald-500" : "bg-amber-500"}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {loadingId === course.id && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
