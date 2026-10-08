import type { LessonContent } from "@/types/lesson";

export const LESSON_JS_1_2: LessonContent = {
  nodeId: "js-1-2",
  title: "Variables & Data",
  totalXp: 15,
  steps: [
    {
      id: "js-1-2-1",
      type: "single_choice",
      title: "Read and code",
      question: "What is the output of this code in the console?",
      codeSnippet: "let score = 10;\nconsole.log(score);",
      options: ["10", "\"score\"", "score", "undefined"],
      correctAnswer: "10",
      explanation: "The variable score holds the number 10, so it prints the value inside it without quotes."
    },
    {
      id: "js-1-2-2",
      type: "fill_blank",
      title: "Fill in the blank",
      instruction: "Select the standard keyword for declaring a variable:",
      codeTemplate: "____ hero = \"Buggy\";",
      options: ["let", "make", "set", "var_name"],
      correctAnswer: "let",
      explanation: "In modern JavaScript, we use 'let' to declare a variable whose value can be changed."
    },
    {
      id: "js-1-2-3",
      type: "single_choice",
      title: "Trace the code",
      question: "What is the final output of this code in the console?",
      codeSnippet: "let energy = 100;\nenergy = 80;\nconsole.log(energy);",
      options: ["100", "80", "180", "Error"],
      correctAnswer: "80",
      explanation: "By writing energy = 80, the new value replaces the previous one."
    },
    {
      id: "js-1-2-4",
      type: "code_order",
      title: "Arrange the code",
      instruction: "Arrange the blocks to declare a variable 'level' with the value 5:",
      lines: ["5", "=", ";", "level", "let"],
      correctOrder: [4, 3, 1, 0, 2],
      explanation: "Variable declaration structure: keyword, name, equals, value, and semicolon."
    },
    {
      id: "js-1-2-5",
      type: "single_choice",
      title: "Constant values",
      question: "What is the result of running this code?",
      codeSnippet: "const pi = 3.14;\npi = 3.15;",
      options: ["Prints 3.15", "TypeError", "Prints 3.14", "undefined"],
      correctAnswer: "TypeError",
      explanation: "A value declared with 'const' is a constant and cannot be reassigned a new value."
    },
    {
      id: "js-1-2-6",
      type: "fill_blank",
      title: "Fill in the blank",
      instruction: "Complete the code to print the actual value of the variable, not the word 'name':",
      codeTemplate: "let name = \"Alex\";\nconsole.log(____);",
      options: ["name", "\"name\"", "'name'", "Alex"],
      correctAnswer: "name",
      explanation: "Using quotes prints the literal word, while the variable name is used without quotes to print its value."
    },
    {
      id: "js-1-2-7",
      type: "single_choice",
      title: "Final challenge",
      question: "What is the output of this program?",
      codeSnippet: "let a = 5;\nlet b = 10;\nlet result = a + b;\nconsole.log(result);",
      options: ["\"510\"", "15", "\"15\"", "NaN"],
      correctAnswer: "15",
      explanation: "The numbers inside the two variables are mathematically added using the + operator."
    }
  ]
};
