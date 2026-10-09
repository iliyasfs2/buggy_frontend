const fs = require('fs');
let file = 'src/components/shared/StreakPopover.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /<Flame className="w-4 h-4 fill-orange-500 text-orange-500" \/>/g,
  '<img src="/icons/streak.png" alt="Streak" className="w-4 h-4 object-contain" />'
);
fs.writeFileSync(file, content);
