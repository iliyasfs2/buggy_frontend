import type { LessonContent, LessonStep } from "@/types/lesson";
import type { MistakeItem } from "@/services/debugApi";
import { shuffleArray } from "@/utils/shuffle";

export const DEBUG_TRACING_LESSON: LessonContent = {
  nodeId: "debug-tracing",
  title: "Code Tracing & Output Prediction",
  totalXp: 20,
  steps: [
    {
      id: "trace_js_01",
      type: "single_choice",
      title: "Form Input Coercion",
      mascotMood: "thinking",
      mascotDialogue: "Trace what gets printed to the console!",
      question: "What is printed to the console?",
      codeSnippet: "const inputVal = \"10\";\nconst total = inputVal + 5;\nconsole.log(total);",
      options: [
        "15",
        "\"105\"",
        "NaN",
        "Error"
      ],
      correctAnswer: "\"105\"",
      explanation: "Because inputVal is a string, the + operator performs string concatenation instead of arithmetic addition."
    },
    {
      id: "trace-2",
      type: "single_choice",
      title: "Block Scope & Hoisting",
      mascotMood: "thinking",
      mascotDialogue: "Check variable scoping within the block!",
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
      id: "trace-3",
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
      id: "trace-4",
      type: "single_choice",
      title: "Array Method Return Values",
      mascotMood: "alert",
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
    }
  ]
};

export const DEBUG_REFACTOR_LESSON: LessonContent = {
  nodeId: "debug-refactor",
  title: "Code Refactoring & Clean Code",
  totalXp: 20,
  steps: [
    {
      id: "refactor_js_01",
      type: "single_choice",
      title: "Filtering Active Buttons",
      mascotMood: "thinking",
      mascotDialogue: "Replace the manual loop with a declarative array method!",
      question: "Which modern ES6 statement cleanly replaces this entire loop?",
      codeSnippet: "const activeButtons = [];\nfor (let i = 0; i < buttons.length; i++) {\n  if (buttons[i].isEnabled) {\n    activeButtons.push(buttons[i]);\n  }\n}",
      options: [
        "const activeButtons = buttons.filter(btn => btn.isEnabled);",
        "const activeButtons = buttons.map(btn => btn.isEnabled);",
        "const activeButtons = buttons.forEach(btn => btn.isEnabled);",
        "const activeButtons = buttons.find(btn => btn.isEnabled);"
      ],
      correctAnswer: "const activeButtons = buttons.filter(btn => btn.isEnabled);",
      explanation: "Array.prototype.filter creates a new array containing only elements that meet the condition without manual loop declarations."
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
    }
  ]
};

export const DEBUG_STORIES_LESSON: LessonContent = {
  nodeId: "debug-stories",
  title: "Code Stories: Theme & Feature Scenarios",
  totalXp: 30,
  steps: [
    {
      id: "story_js_01",
      type: "single_choice",
      title: "Theme Switcher Toggle",
      mascotMood: "thinking",
      mascotDialogue: "Buggy is implementing a theme switcher button. The button must add the 'dark' class if absent, or remove it if already present.",
      question: "Which classList method alternates adding and removing the class?",
      codeSnippet: "const themeBtn = document.querySelector('#theme-toggle');\n\nthemeBtn.addEventListener('click', () => {\n  document.body.classList._______('dark');\n});",
      options: [
        "toggle",
        "switch",
        "replace",
        "add"
      ],
      correctAnswer: "toggle",
      explanation: "classList.toggle adds the class if not present and removes it if it is already applied."
    },
    {
      id: "story-2",
      type: "single_choice",
      title: "Scenario Step 2: Balance Guard",
      mascotMood: "alert",
      mascotDialogue: "Buggy wants to buy an item in the store. First check if they can afford it!",
      question: "Which condition correctly verifies that the user has sufficient bytes for purchase?",
      codeSnippet: "function canPurchase(userBytes, itemPrice) {\n  return userBytes >= itemPrice;\n}",
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
      id: "story-3",
      type: "single_choice",
      title: "Scenario Step 3: Full Battery Guard",
      mascotMood: "thinking",
      mascotDialogue: "We should not let users waste currency refilling an already full battery!",
      question: "Which guard condition ensures battery refill is only allowed when energy is not full?",
      codeSnippet: "function canRefillBattery(currentBattery, maxBattery = 5) {\n  return currentBattery < maxBattery;\n}",
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
