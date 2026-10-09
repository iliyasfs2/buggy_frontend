const fs = require('fs');
let file = 'src/app/streak/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("Continue Let's Go", "Continue Let&apos;s Go");
fs.writeFileSync(file, content);
