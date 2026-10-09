const fs = require('fs');

function fixFile(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

fixFile('src/components/shared/BatteryPopover.tsx');
fixFile('src/components/shared/BytePopover.tsx');
