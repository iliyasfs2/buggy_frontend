const fs = require('fs');
let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

const brokenPart = 'e.currentTarget.parentElement.innerHTML = `<div class="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center"><svg xmlns="http:\n                  }}';
const fixedPart = 'e.currentTarget.parentElement.innerHTML = `<div class="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8 text-rose-500"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>`;\n                  }}';

content = content.replace(brokenPart, fixedPart);

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
