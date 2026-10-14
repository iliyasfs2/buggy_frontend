import type { LessonContent, LessonStep } from "@/types/lesson";
import type { MistakeItem } from "@/services/debugApi";
import { shuffleArray } from "@/utils/shuffle";

export const DEBUG_TRACING_LESSON: LessonContent = {
  nodeId: "debug-tracing",
  title: "What prints?",
  totalXp: 15,
  steps: [
    {
      id: "trace_js_01",
      type: "single_choice",
      title: "What prints?",
      mascotMood: "thinking",
      mascotDialogue: "Trace what gets printed to the console!",
      question: "What is printed to the console?",
      codeSnippet: "console.log(\"Bug\" + 404);",
      options: [
        "\"Bug404\"",
        "NaN",
        "404",
        "Error"
      ],
      correctAnswer: "\"Bug404\"",
      explanation: "Adding text and a number glues them together into a single string!"
    }
  ]
};

export const DEBUG_REFACTOR_LESSON: LessonContent = {
  nodeId: "debug-refactor",
  title: "Clean safe reading",
  totalXp: 20,
  steps: [
    {
      id: "refactor_js_01",
      type: "code_order",
      title: "Clean safe reading",
      mascotMood: "thinking",
      mascotDialogue: "Tap the blocks to safely read user name in modern JS!",
      instruction: "Tap the blocks to safely read user name in modern JS:",
      lines: [
        "user",
        "?.name",
        "const",
        "name",
        "=",
        ";",
        "user.name"
      ],
      correctOrder: [2, 3, 4, 0, 1, 5],
      explanation: "Optional chaining (?.) safely reads properties without throwing errors if user is null!"
    }
  ]
};

export const DEBUG_STORIES_LESSON: LessonContent = {
  nodeId: "debug-stories",
  title: "Fix Buggy's Button",
  totalXp: 30,
  steps: [
    {
      id: "story_js_01",
      type: "fill_blank",
      title: "Fix Buggy's Button",
      mascotMood: "alert",
      mascotDialogue: "Buggy: \"My submit button is frozen! Help me make it clickable.\"",
      instruction: "Fill in the blank to enable the button:",
      codeTemplate: "submitBtn.____ = false;",
      options: [
        "disabled",
        "hidden",
        "locked",
        "active"
      ],
      correctAnswer: "disabled",
      explanation: "Setting disabled = false activates the button and allows clicks!"
    }
  ]
};

export function createMistakesLesson(mistakes: MistakeItem[]): LessonContent {
  const steps: LessonStep[] = mistakes.map((m, idx) => {
    const defaultDistractors = ["10 20", "undefined", "false", "ReferenceError", "null", "NaN", "0"];
    const filteredDistractors = defaultDistractors.filter(
      (d) => d !== m.correct_answer && d !== m.user_answer
    );

    const rawOptions = [
      m.correct_answer,
      m.user_answer || filteredDistractors[0],
      filteredDistractors[1] || "undefined",
      filteredDistractors[2] || "Error"
    ];

    const uniqueOptions = Array.from(new Set(rawOptions.filter(Boolean)));
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(`Option ${uniqueOptions.length + 1}`);
    }

    const randomizedOptions = shuffleArray(uniqueOptions);

    return {
      id: `mistake-${m.id}`,
      type: "single_choice" as const,
      mistakeId: m.id,
      title: m.lesson_title || `Bug #${idx + 1}`,
      mascotMood: "alert" as const,
      mascotDialogue: "Analyze and resolve this bug without energy risk!",
      question: m.question_title || "What is the correct output or fix?",
      codeSnippet: m.code_snippet,
      options: randomizedOptions,
      correctAnswer: m.correct_answer,
      explanation: m.explanation || "Review the correct code output above."
    };
  });

  return {
    nodeId: "debug-mistakes",
    title: "Mistakes Bank: Targeted Bug Review",
    totalXp: Math.max(10, mistakes.length * 10),
    steps
  };
}
