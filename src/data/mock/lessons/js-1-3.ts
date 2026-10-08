import type { LessonContent } from "@/types/lesson";

export const LESSON_JS_1_3: LessonContent = {
  nodeId: "js-1-3",
  title: "Data Types",
  totalXp: 20,
  steps: [
    {
      id: "js-1-3-1",
      type: "single_choice",
      title: "Identify Type",
      question: "Which value is a valid string?",
      options: ["\"Hello World\"", "Hello World", "100", "true"],
      correctAnswer: "\"Hello World\"",
      explanation: "A string is always wrapped in quotes."
    },
    {
      id: "js-1-3-2",
      type: "fill_blank",
      title: "True or False",
      instruction: "Set the variable to active:",
      codeTemplate: "let isOnline = ____;",
      options: ["true", "\"true\"", "yes", "on"],
      correctAnswer: "true",
      explanation: "Booleans don't need quotes."
    },
    {
      id: "js-1-3-3",
      type: "single_choice",
      title: "Check the type",
      question: "What does this code log to the console?",
      codeSnippet: "let count = 42;\nconsole.log(typeof count);",
      options: ["\"number\"", "42", "\"count\"", "\"string\""],
      correctAnswer: "\"number\"",
      explanation: "The typeof operator returns the type as a string."
    },
    {
      id: "js-1-3-4",
      type: "single_choice",
      title: "Spot the trick",
      question: "What is the output of typeof for this variable?",
      codeSnippet: "let zipCode = \"10021\";\nconsole.log(typeof zipCode);",
      options: ["\"string\"", "\"number\"", "10021", "undefined"],
      correctAnswer: "\"string\"",
      explanation: "Any value wrapped in quotes is a string, even if it contains numbers."
    },
    {
      id: "js-1-3-5",
      type: "code_order",
      title: "Build the statement",
      instruction: "Assemble the blocks to declare the game over status:",
      lines: ["let", "isGameOver", "=", "false", ";"],
      correctOrder: [0, 1, 2, 3, 4],
      explanation: "Standard variable assignment."
    },
    {
      id: "js-1-3-6",
      type: "single_choice",
      title: "Empty variable",
      question: "What does logging an unassigned variable output?",
      codeSnippet: "let playerWeapon;\nconsole.log(playerWeapon);",
      options: ["undefined", "null", "0", "Error"],
      correctAnswer: "undefined",
      explanation: "A declared variable with no assigned value is undefined."
    }
  ]
};
