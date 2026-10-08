import type { LessonContent } from "@/types/lesson";

export const LESSON_JS_1_5: LessonContent = {
  nodeId: "js-1-5",
  title: "Template Literals",
  totalXp: 35,
  steps: [
    {
      id: "js-1-5-1",
      type: "single_choice",
      title: "Modern Strings",
      question: "Which character is used to create a Template Literal?",
      options: ["Backtick ( ` )", "Double Quote ( \" )", "Single Quote ( ' )", "Parenthesis ( () )"],
      correctAnswer: "Backtick ( ` )",
      explanation: "Backticks allow for multi-line strings and interpolation."
    },
    {
      id: "js-1-5-2",
      type: "fill_blank",
      title: "String Interpolation",
      instruction: "Fill in the symbol required to embed the variable:",
      codeTemplate: "let user = \"Buggy\";\nlet msg = `Welcome, ____{user}!`;",
      options: ["$", "#", "@", "&"],
      correctAnswer: "$",
      explanation: "The ${} syntax allows you to embed variables in a template literal."
    },
    {
      id: "js-1-5-3",
      type: "single_choice",
      title: "Evaluate output",
      question: "What does this code print?",
      codeSnippet: "let item = \"Sword\";\nlet price = 50;\nconsole.log(`Buy ${item} for ${price} coins`);",
      options: ["Buy Sword for 50 coins", "Buy item for price coins", "Buy ${item} for ${price} coins", "Error"],
      correctAnswer: "Buy Sword for 50 coins",
      explanation: "The variables inside ${} are evaluated and injected into the string."
    },
    {
      id: "js-1-5-4",
      type: "single_choice",
      title: "In-line Math",
      question: "What is the logged output?",
      codeSnippet: "let hp = 70;\nconsole.log(`Missing HP: ${100 - hp}`);",
      options: ["Missing HP: 30", "Missing HP: 100 - 70", "Missing HP: ${30}", "Missing HP: 70"],
      correctAnswer: "Missing HP: 30",
      explanation: "You can put any JavaScript expression inside ${}, including math."
    },
    {
      id: "js-1-5-5",
      type: "code_order",
      title: "Boss Final Craft",
      instruction: "Assemble the blocks to construct the formatted string:",
      lines: ["let info =", "`", "Level: ${lvl}", "`", ";"],
      correctOrder: [0, 1, 2, 3, 4],
      explanation: "A template literal starts and ends with a backtick."
    },
    {
      id: "js-1-5-6",
      type: "single_choice",
      title: "Find the syntax bug",
      question: "Why did this code log the syntax literally instead of interpolating the value?",
      codeSnippet: "let hero = \"Buggy\";\nlet alertMsg = 'Welcome, ${hero}!';\nconsole.log(alertMsg);",
      options: ["Regular quotes were used instead of backticks (`)", "The hero variable must be declared with const", "The $ symbol is not valid inside text", "Variables cannot be placed inside strings"],
      correctAnswer: "Regular quotes were used instead of backticks (`)",
      explanation: "Interpolation ${} only works inside backticks (`), not single or double quotes."
    }
  ]
};
