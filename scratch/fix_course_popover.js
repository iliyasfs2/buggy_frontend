const fs = require('fs');
let file = 'src/components/shared/CoursePopover.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync(file, content);
