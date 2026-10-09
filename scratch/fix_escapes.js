const fs = require('fs');
const file = 'src/components/shared/StreakPopover.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(file, content);
