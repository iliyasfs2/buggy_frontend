import type { LessonContent } from "@/types/lesson";

export const LESSON_JS_1_4: LessonContent = {
  nodeId: "js-1-4",
  title: "Operators & Math",
  totalXp: 25,
  steps: [
    {
      id: "js-1-4-1",
      type: "single_choice",
      title: "Remainder operator",
      question: "What is the output of the modulus operator?",
      codeSnippet: "let result = 10 % 3;\nconsole.log(result);",
      options: ["1", "3", "0", "3.33"],
      correctAnswer: "1",
      explanation: "10 divided by 3 is 9, leaving a remainder of 1."
    },
    {
      id: "js-1-4-2",
      type: "single_choice",
      title: "String addition",
      question: "What is logged when adding a string and a number?",
      codeSnippet: "let score = \"5\" + 5;\nconsole.log(score);",
      options: ["\"55\"", "10", "Error", "NaN"],
      correctAnswer: "\"55\"",
      explanation: "When adding a string and a number, JS converts the number to a string and concatenates them."
    },
    {
      id: "js-1-4-3",
      type: "fill_blank",
      title: "Short syntax",
      instruction: "Fill in the increment operator to increase level by 1:",
      codeTemplate: "let level = 1;\nlevel____;\nconsole.log(level);",
      options: ["++", "+1", "+=", "**"],
      correctAnswer: "++",
      explanation: "The ++ operator increments a numeric variable by 1."
    },
    {
      id: "js-1-4-4",
      type: "single_choice",
      title: "Order of operations",
      question: "What does this code print?",
      codeSnippet: "let total = 2 + 3 * 4;\nconsole.log(total);",
      options: ["14", "20", "24", "10"],
      correctAnswer: "14",
      explanation: "Multiplication happens before addition (3 * 4 = 12, + 2 = 14)."
    },
    {
      id: "js-1-4-5",
      type: "code_order",
      title: "Compound assignment",
      instruction: "Assemble the blocks to add 10 to coins:",
      lines: ["coins", "+=", "10", ";"],
      correctOrder: [0, 1, 2, 3],
      explanation: "Compound assignment adds and updates the variable."
    },
    {
      id: "js-1-4-6",
      type: "single_choice",
      title: "Coercion challenge",
      question: "How does JavaScript evaluate this subtraction?",
      codeSnippet: "let val = \"10\" - 2;\nconsole.log(val);",
      options: ["8", "\"8\"", "NaN", "Error"],
      correctAnswer: "8",
      explanation: "Unlike addition, subtraction forces JS to convert the string to a number."
    }
  ]
};
