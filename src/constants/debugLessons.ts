import type { LessonContent, LessonStep } from "@/types/lesson";
import type {
  MistakeItem,
  DebugChallengesData,
  OutputLabDrill,
  CleanCodeDrill,
  MiniScenarioDrill,
} from "@/services/debugApi";
import { shuffleArray } from "@/utils/shuffle";

export const SEED_OUTPUT_LAB: OutputLabDrill[] = [
  {
    id: "out_1",
    code: "let x = 10;\nx += 5;\nconsole.log(x);",
    options: ["10", "15", "5", "Error"],
    answer: "15",
    explanation: "x += 5 adds 5 to 10, so x becomes 15.",
  },
  {
    id: "out_2",
    code: "console.log(\"5\" + 2);",
    options: ["7", "\"52\"", "5", "NaN"],
    answer: "\"52\"",
    explanation: "Adding a string and a number joins them together as text.",
  },
  {
    id: "out_3",
    code: "const items = [\"js\", \"py\", \"css\"];\nconsole.log(items[1]);",
    options: ["\"js\"", "\"py\"", "\"css\"", "undefined"],
    answer: "\"py\"",
    explanation: "Array index starts at 0, so index 1 is the second item.",
  },
  {
    id: "out_4",
    code: "let isReady = false;\nconsole.log(!isReady);",
    options: ["false", "true", "null", "undefined"],
    answer: "true",
    explanation: "The ! operator flips false to true.",
  },
  {
    id: "out_5",
    code: "const nums = [2, 4, 6];\nconst res = nums.map(n => n * 2);\nconsole.log(res[0]);",
    options: ["2", "4", "6", "12"],
    answer: "4",
    explanation: "map() doubles every item, so the first item becomes 4.",
  },
  {
    id: "out_6",
    code: "let count = 0;\nfor (let i = 0; i < 3; i++) {\n  count++;\n}\nconsole.log(count);",
    options: ["2", "3", "4", "0"],
    answer: "3",
    explanation: "The loop runs 3 times (i = 0, 1, 2), increasing count to 3.",
  },
  {
    id: "out_7",
    code: "const user = { name: \"Sara\" };\nconsole.log(user.age ?? 18);",
    options: ["undefined", "null", "18", "0"],
    answer: "18",
    explanation: "The ?? operator returns 18 because user.age is undefined.",
  },
  {
    id: "out_8",
    code: "const word = \"Buggy\";\nconsole.log(word.slice(0, 3));",
    options: ["\"Bug\"", "\"Bugg\"", "\"ug\"", "\"ggy\""],
    answer: "\"Bug\"",
    explanation: "slice(0, 3) takes characters from index 0 up to 2.",
  },
];

export const SEED_CLEAN_CODE: CleanCodeDrill[] = [
  {
    id: "clean_1",
    messy_code: "const msg = \"Hello \" + name + \"!\";",
    prompt: "Make this string cleaner with template literals:",
    options: [
      "const msg = `Hello ${name}!`;",
      "const msg = 'Hello ${name}!';",
      "const msg = `Hello $name!`;",
    ],
    answer: "const msg = `Hello ${name}!`;",
    explanation: "Backticks (`) let you put variables directly inside strings.",
  },
  {
    id: "clean_2",
    messy_code: "if (isLoggedIn === true) {\n  return true;\n} else {\n  return false;\n}",
    prompt: "Simplify this redundant boolean check:",
    options: [
      "return isLoggedIn;",
      "return isLoggedIn == true;",
      "if (isLoggedIn) return;",
    ],
    answer: "return isLoggedIn;",
    explanation: "isLoggedIn is already a boolean, so you can return it directly.",
  },
  {
    id: "clean_3",
    messy_code: "const title = post.title;\nconst author = post.author;",
    prompt: "Use object destructuring in one line:",
    options: [
      "const { title, author } = post;",
      "const [ title, author ] = post;",
      "const post = { title, author };",
    ],
    answer: "const { title, author } = post;",
    explanation: "Object destructuring extracts multiple properties in one clean line.",
  },
  {
    id: "clean_4",
    messy_code: "function double(n) {\n  return n * 2;\n}",
    prompt: "Convert to a concise arrow function:",
    options: [
      "const double = n => n * 2;",
      "const double = n => { n * 2 };",
      "arrow double(n) => n * 2;",
    ],
    answer: "const double = n => n * 2;",
    explanation: "Single-line arrow functions automatically return the expression.",
  },
  {
    id: "clean_5",
    messy_code: "const all = listA.concat(listB);",
    prompt: "Merge both arrays using the modern spread operator:",
    options: [
      "const all = [...listA, ...listB];",
      "const all = [listA, listB];",
      "const all = { ...listA, ...listB };",
    ],
    answer: "const all = [...listA, ...listB];",
    explanation: "The spread operator (...) unpacks array items cleanly.",
  },
  {
    id: "clean_6",
    messy_code: "let status;\nif (age >= 18) {\n  status = \"Adult\";\n} else {\n  status = \"Minor\";\n}",
    prompt: "Use a single-line ternary operator:",
    options: [
      "const status = age >= 18 ? \"Adult\" : \"Minor\";",
      "const status = age >= 18 : \"Adult\" ? \"Minor\";",
      "const status = if (age >= 18) \"Adult\" else \"Minor\";",
    ],
    answer: "const status = age >= 18 ? \"Adult\" : \"Minor\";",
    explanation: "Ternary operators make simple if/else assignments short and readable.",
  },
  {
    id: "clean_7",
    messy_code: "if (user && user.profile && user.profile.avatar) {\n  show(user.profile.avatar);\n}",
    prompt: "Safely read nested properties with optional chaining:",
    options: [
      "if (user?.profile?.avatar) show(user.profile.avatar);",
      "if (user.profile?.avatar) show(user.avatar);",
      "if (user??profile??avatar) show(avatar);",
    ],
    answer: "if (user?.profile?.avatar) show(user.profile.avatar);",
    explanation: "Optional chaining (?.) stops safely if any parent object is missing.",
  },
  {
    id: "clean_8",
    messy_code: "const active = [];\nfor (let i = 0; i < users.length; i++) {\n  if (users[i].isOnline) active.push(users[i]);\n}",
    prompt: "Replace this loop with a built-in array method:",
    options: [
      "const active = users.filter(u => u.isOnline);",
      "const active = users.map(u => u.isOnline);",
      "const active = users.find(u => u.isOnline);",
    ],
    answer: "const active = users.filter(u => u.isOnline);",
    explanation: "filter() returns a new array with only the items that pass the test.",
  },
];

export const SEED_MINI_SCENARIOS: MiniScenarioDrill[] = [
  {
    id: "scen_1",
    title: "Build a Shopping Cart Total",
    subtitle: "Calculate prices and apply a discount code in 3 steps.",
    steps: [
      {
        step: 1,
        instruction: "First, sum all item prices using reduce():",
        code_template: "const prices = [10, 20, 30];\nconst total = prices.___((sum, p) => sum + p, 0);",
        options: ["reduce", "map", "filter"],
        answer: "reduce",
      },
      {
        step: 2,
        instruction: "Check if the user has a valid promo code:",
        code_template: "const hasPromo = true;\nconst discount = hasPromo ___ 10 : 0;",
        options: ["?", "&&", "??"],
        answer: "?",
      },
      {
        step: 3,
        instruction: "Return the final price after discount:",
        code_template: "const finalPrice = total - discount;\n___ finalPrice;",
        options: ["return", "console.log", "break"],
        answer: "return",
      },
    ],
  },
  {
    id: "scen_2",
    title: "Password Strength Checker",
    subtitle: "Validate a user password before form submit.",
    steps: [
      {
        step: 1,
        instruction: "Remove extra spaces from both ends of the password:",
        code_template: "const rawPass = \"  secret123  \";\nconst cleanPass = rawPass.___();",
        options: ["trim", "slice", "split"],
        answer: "trim",
      },
      {
        step: 2,
        instruction: "Check if the password has at least 8 characters:",
        code_template: "const isLongEnough = cleanPass.___ >= 8;",
        options: ["length", "size", "count"],
        answer: "length",
      },
      {
        step: 3,
        instruction: "Make sure it contains a number or special symbol:",
        code_template: "const isValid = isLongEnough ___ cleanPass.includes(\"1\");",
        options: ["&&", "||", "!=="],
        answer: "&&",
      },
    ],
  },
  {
    id: "scen_3",
    title: "Fetch User Profile from API",
    subtitle: "Load user data safely from a backend server.",
    steps: [
      {
        step: 1,
        instruction: "Mark the function as asynchronous so we can use await:",
        code_template: "___ function loadUser() {\n  const res = await fetch(\"/api/user\");",
        options: ["async", "await", "defer"],
        answer: "async",
      },
      {
        step: 2,
        instruction: "Convert the server response into a JSON object:",
        code_template: "  const data = await res.___();\n  return data;",
        options: ["json", "parse", "text"],
        answer: "json",
      },
      {
        step: 3,
        instruction: "Catch network errors so the app never crashes:",
        code_template: "} ___ (error) {\n  console.log(\"Failed to load user\");\n}",
        options: ["catch", "else", "finally"],
        answer: "catch",
      },
    ],
  },
  {
    id: "scen_4",
    title: "Dark Mode Toggle Button",
    subtitle: "Switch themes and save the choice in the browser.",
    steps: [
      {
        step: 1,
        instruction: "Select the theme button from the DOM:",
        code_template: "const btn = document.___(\"#theme-btn\");",
        options: ["querySelector", "getElement", "select"],
        answer: "querySelector",
      },
      {
        step: 2,
        instruction: "Toggle the dark class on the page body when clicked:",
        code_template: "btn.addEventListener(\"click\", () => {\n  document.body.classList.___(\"dark\");\n});",
        options: ["toggle", "switch", "change"],
        answer: "toggle",
      },
      {
        step: 3,
        instruction: "Save the theme choice in localStorage:",
        code_template: "localStorage.___(\"theme\", \"dark\");",
        options: ["setItem", "save", "push"],
        answer: "setItem",
      },
    ],
  },
];

export const SEED_DEBUG_CHALLENGES: DebugChallengesData = {
  output_lab: SEED_OUTPUT_LAB,
  clean_code: SEED_CLEAN_CODE,
  mini_scenarios: SEED_MINI_SCENARIOS,
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
      filteredDistractors[2] || "Error",
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
      explanation: m.explanation || "Review the correct code output above.",
    };
  });

  return {
    nodeId: "debug-mistakes",
    title: "Mistakes Bank: Targeted Bug Review",
    totalXp: Math.max(10, mistakes.length * 10),
    steps,
  };
}
