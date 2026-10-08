import type { LessonContent } from "@/types/lesson";

export const LESSON_JS_1_1: LessonContent = {
  nodeId: "js-1-1",
  title: "Hello Console",
  totalXp: 15,
  steps: [
    {
      id: "step-1",
      type: "theory",
      title: "The Console Window",
      mascotMood: "idle",
      mascotDialogue: "Beep boop! I'm Buggy. Let's make your code speak!",
      content: "The console is where your code speaks. To print a message, we use console.log().",
      codeSnippet: 'console.log("Hello Buggy");',
      explanation: "console.log() sends data to the output screen.",
      continueText: "Continue"
    },
    {
      id: "step-2",
      type: "single_choice",
      title: "Print Output",
      mascotMood: "idle",
      mascotDialogue: "Look closely at the quotes. What prints on the screen?",
      question: "What does this code print to the console?",
      codeSnippet: 'console.log("Buggy");',
      options: [
        "Buggy",
        '"Buggy"',
        "console.log",
        "Error"
      ],
      correctAnswer: "Buggy",
      correctIndex: 0,
      explanation: "Text inside quotation marks prints without the quotes."
    },
    {
      id: "step-3",
      type: "fill_blank",
      title: "Complete the Command",
      mascotMood: "alert",
      mascotDialogue: "A piece of the method name is missing. Can you complete it?",
      instruction: "Complete the command to log this message:",
      codeTemplate: 'console.____("Starting...");',
      options: ["log", "print", "write", "send"],
      correctAnswer: "log",
      acceptedAnswers: ["log"],
      explanation: "The log method belongs to the console object."
    },
    {
      id: "step-4",
      type: "single_choice",
      title: "Numbers in JavaScript",
      mascotMood: "thinking",
      mascotDialogue: "Numbers and strings behave differently in code. Why?",
      question: "Why doesn't the number 42 need quotation marks?",
      codeSnippet: "console.log(42);",
      options: [
        "Numbers in JavaScript do not need quotes",
        "This code has a syntax error",
        "Numbers must be wrapped in square brackets"
      ],
      correctAnswer: "Numbers in JavaScript do not need quotes",
      correctIndex: 0,
      explanation: "Numbers are written directly; only strings require quotes."
    },
    {
      id: "step-5",
      type: "code_order",
      title: "Arrange the Blocks",
      mascotMood: "happy",
      mascotDialogue: "Snap the code blocks together in the correct execution order!",
      instruction: "Arrange the blocks to print the number 10:",
      lines: ["console", ".log", "(", "10", ");"],
      correctOrder: [0, 1, 2, 3, 4],
      explanation: "Function calls require the object, method, parentheses, and closing semicolon."
    },
    {
      id: "step-6",
      type: "bug_hunt",
      title: "Spot the Bug",
      mascotMood: "alert",
      mascotDialogue: "Red alert! This code crashed. Where is the bug?",
      instruction: "This code crashes! Where is the bug?",
      codeSnippet: 'console.log("Ready to code;',
      options: [
        "Missing closing quote and parenthesis",
        "log must be uppercase",
        "console is misspelled"
      ],
      correctAnswer: "Missing closing quote and parenthesis",
      correctIndex: 0,
      explanation: "Every opened quotation mark and parenthesis must be closed before the semicolon."
    },
    {
      id: "step-7",
      type: "single_choice",
      title: "Execution Order",
      mascotMood: "thinking",
      mascotDialogue: "JavaScript executes top-to-bottom. Predict the output order!",
      question: "In what order will these messages print?",
      codeSnippet: 'console.log("Step 1");\nconsole.log("Step 2");',
      options: [
        "Step 1 first, then Step 2 on a new line",
        "Both on the same line: Step 1 Step 2",
        "Step 2 first, then Step 1"
      ],
      correctAnswer: "Step 1 first, then Step 2 on a new line",
      correctIndex: 0,
      explanation: "JavaScript executes instructions line by line from top to bottom."
    },
    {
      id: "step-8",
      type: "fill_blank",
      title: "Pass String Value",
      mascotMood: "celebrate",
      mascotDialogue: "Final boss step! Wrap the string and launch the console!",
      instruction: 'Pass the string "JS" into the console to print it:',
      codeTemplate: "console.log(____);",
      options: ['"JS"', "'JS'", "JS", "console"],
      correctAnswer: '"JS"',
      acceptedAnswers: ['"JS"', "'JS'"],
      explanation: "Any text must be wrapped inside quotes when passed to console.log."
    }
  ]
};
