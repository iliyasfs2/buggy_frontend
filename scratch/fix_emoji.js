const fs = require('fs');
const file = 'src/components/shared/StreakPopover.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("Today's streak is secured! ???", "Today's streak is secured!");

fs.writeFileSync(file, content);
