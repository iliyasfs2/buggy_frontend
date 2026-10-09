const fs = require('fs');

function fixFile(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

fixFile('src/app/battery/page.tsx');
fixFile('src/app/bytes/page.tsx');
fixFile('src/app/streak/page.tsx');
