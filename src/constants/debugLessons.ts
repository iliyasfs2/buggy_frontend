import type { LessonContent, LessonStep } from "@/types/lesson";
import type { MistakeItem } from "@/services/debugApi";

export const DEBUG_TRACING_LESSON: LessonContent = {
  nodeId: "debug-tracing",
  title: "Code Tracing & Output Prediction",
  totalXp: 20,
  steps: [
    {
      id: "trace-1",
      type: "single_choice",
      title: "Block Scope & Hoisting",
      mascotMood: "thinking",
      mascotDialogue: "Trace what gets printed to the console!",
      question: "What is the output of the following console.log statement?",
      codeSnippet: "function checkScope() {\n  if (true) {\n    var a = 10;\n    let b = 20;\n  }\n  console.log(a, typeof b);\n}\ncheckScope();",
      options: [
        "10 undefined",
        "10 20",
        "undefined undefined",
        "ReferenceError"
      ],
      correctAnswer: "10 undefined",
      explanation: "var is function-scoped so 'a' persists outside the if-block, while let is block-scoped so 'b' is out of scope and typeof returns 'undefined'."
    },
    {
      id: "trace-2",
      type: "single_choice",
      title: "Equality & Reference",
      mascotMood: "thinking",
      mascotDialogue: "Think about how arrays are compared in memory!",
      question: "What is the output of the following console.log statement?",
      codeSnippet: "const listA = [1, 2];\nconst listB = [1, 2];\nconsole.log(listA == listB, listA === listB);",
      options: [
        "false false",
        "true true",
        "true false",
        "false true"
      ],
      correctAnswer: "false false",
      explanation: "JavaScript arrays and objects are compared by reference identity, not structural content. Two different instances are never equal."
    },
    {
      id: "trace-3",
      type: "single_choice",
      title: "Array Method Return Values",
      mascotMood: "thinking",
      mascotDialogue: "Be careful: what does push return?",
      question: "What is the output of the following console.log statement?",
      codeSnippet: "const numbers = [1, 2, 3];\nconst result = numbers.push(4);\nconsole.log(result);",
      options: [
        "4",
        "[1, 2, 3, 4]",
        "3",
        "undefined"
      ],
      correctAnswer: "4",
      explanation: "Array.prototype.push mutates the array in-place and returns the new length of the array (4), not the array itself."
    },
    {
      id: "trace-4",
      type: "single_choice",
      title: "Type Coercion",
      mascotMood: "alert",
      mascotDialogue: "Watch out for string concatenation traps!",
      question: "What is the output of the following console.log statement?",
      codeSnippet: "const value = 1 + \"2\" + 3;\nconsole.log(value, typeof value);",
      options: [
        "123 string",
        "6 number",
        "15 string",
        "NaN string"
      ],
      correctAnswer: "123 string",
      explanation: "The addition operator with a string triggers coercion: 1 + '2' evaluates to '12', then '12' + 3 evaluates to '123' with string type."
    }
  ]
};

export const DEBUG_REFACTOR_LESSON: LessonContent = {
  nodeId: "debug-refactor",
  title: "Code Refactoring & Clean Code",
  totalXp: 20,
  steps: [
    {
      id: "refactor-1",
      type: "single_choice",
      title: "Array Transformations",
      mascotMood: "thinking",
      mascotDialogue: "Replace the imperative loop with modern declarative syntax!",
      question: "Which modern ES6+ expression is the cleanest replacement for this loop?",
      codeSnippet: "let doubled = [];\nfor (let i = 0; i < arr.length; i++) {\n  doubled.push(arr[i] * 2);\n}",
      options: [
        "const doubled = arr.map(n => n * 2);",
        "const doubled = arr.filter(n => n * 2);",
        "const doubled = arr.forEach(n => n * 2);",
        "const doubled = arr.reduce(n => n * 2);"
      ],
      correctAnswer: "const doubled = arr.map(n => n * 2);",
      explanation: "Array.prototype.map() cleanly transforms every item without manual iteration or array push mutations."
    },
    {
      id: "refactor-2",
      type: "single_choice",
      title: "Safe Property Access",
      mascotMood: "thinking",
      mascotDialogue: "How do we simplify nested null checks?",
      question: "Which modern syntax simplifies this deep property check?",
      codeSnippet: "function getCity(user) {\n  if (user && user.profile && user.profile.city) {\n    return user.profile.city;\n  }\n  return \"Unknown\";\n}",
      options: [
        "return user?.profile?.city ?? 'Unknown';",
        "return user.profile.city || 'Unknown';",
        "return user?.profile.city || false;",
        "return user.profile?.city && 'Unknown';"
      ],
      correctAnswer: "return user?.profile?.city ?? 'Unknown';",
      explanation: "Optional chaining (?.) prevents runtime TypeError on null/undefined, and nullish coalescing (??) provides safe fallback."
    },
    {
      id: "refactor-3",
      type: "single_choice",
      title: "Filtering Elements",
      mascotMood: "thinking",
      mascotDialogue: "Replace verbose conditional pushing with a filter method!",
      question: "Which method cleanly filters even numbers into a new array?",
      codeSnippet: "let evens = [];\nfor (const n of numbers) {\n  if (n % 2 === 0) {\n    evens.push(n);\n  }\n}",
      options: [
        "const evens = numbers.filter(n => n % 2 === 0);",
        "const evens = numbers.map(n => n % 2 === 0);",
        "const evens = numbers.find(n => n % 2 === 0);",
        "const evens = numbers.some(n => n % 2 === 0);"
      ],
      correctAnswer: "const evens = numbers.filter(n => n % 2 === 0);",
      explanation: "Array.prototype.filter() returns a new array with all elements matching the condition in a single declarative line."
    }
  ]
};

export const DEBUG_STORIES_LESSON: LessonContent = {
  nodeId: "debug-stories",
  title: "Code Stories: Store Transaction System",
  totalXp: 30,
  steps: [
    {
      id: "story-1",
      type: "single_choice",
      title: "Scenario Step 1: Balance Guard",
      mascotMood: "alert",
      mascotDialogue: "Buggy wants to buy an item in the store. First check if they can afford it!",
      question: "Which condition correctly verifies that the user has sufficient bytes for purchase?",
      codeSnippet: "function canPurchase(userBytes, itemPrice) {\n  return /* condition */;\n}",
      options: [
        "userBytes >= itemPrice",
        "userBytes > 0",
        "userBytes === itemPrice",
        "itemPrice > userBytes"
      ],
      correctAnswer: "userBytes >= itemPrice",
      explanation: "The user must possess at least equal or greater currency than the price of the item to proceed."
    },
    {
      id: "story-2",
      type: "single_choice",
      title: "Scenario Step 2: Deduct Balance",
      mascotMood: "happy",
      mascotDialogue: "Now deduct the item cost from the balance!",
      question: "Which statement properly returns the updated balance after purchase?",
      codeSnippet: "function deductBytes(userBytes, itemPrice) {\n  if (userBytes >= itemPrice) {\n    return /* updated balance */;\n  }\n  return userBytes;\n}",
      options: [
        "userBytes - itemPrice",
        "userBytes + itemPrice",
        "itemPrice - userBytes",
        "0"
      ],
      correctAnswer: "userBytes - itemPrice",
      explanation: "Subtracting itemPrice from current userBytes accurately reflects the post-purchase balance."
    },
    {
      id: "story-3",
      type: "single_choice",
      title: "Scenario Step 3: Full Battery Guard",
      mascotMood: "thinking",
      mascotDialogue: "We should not let users waste currency refilling an already full battery!",
      question: "Which guard condition ensures battery refill is only allowed when energy is not full?",
      codeSnippet: "function canRefillBattery(currentBattery, maxBattery = 5) {\n  return /* condition */;\n}",
      options: [
        "currentBattery < maxBattery",
        "currentBattery === maxBattery",
        "currentBattery > 0",
        "maxBattery <= 5"
      ],
      correctAnswer: "currentBattery < maxBattery",
      explanation: "Refilling is only permissible if current battery is strictly less than max capacity."
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

    return {
      id: `mistake-${m.id}`,
      type: "single_choice" as const,
      mistakeId: m.id,
      title: m.lesson_title || `Bug #${idx + 1}`,
      mascotMood: "alert" as const,
      mascotDialogue: "Analyze and resolve this bug without energy risk!",
      question: m.question_title || "What is the correct output or fix?",
      codeSnippet: m.code_snippet,
      options: uniqueOptions,
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
