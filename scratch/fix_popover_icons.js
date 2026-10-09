const fs = require('fs');

function replaceFile(path, regex, replacement) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content);
}

replaceFile('src/components/shared/StreakPopover.tsx', 
  /<Flame[\s\S]*?\/>/, 
  '<img src="/icons/streak.png" alt="Streak" className={`w-16 h-16 object-contain ${hasCompletedToday ? "" : "grayscale opacity-50"}`} />'
);

replaceFile('src/components/shared/BytePopover.tsx', 
  /<Coins[\s\S]*?\/>/, 
  '<img src="/icons/byte.png" alt="Byte" className="w-16 h-16 object-contain" />'
);

replaceFile('src/components/shared/BatteryPopover.tsx', 
  /<motion\.div[\s\S]*?w-10 h-16 rounded-md[\s\S]*?<\/motion\.div>/, 
  '<img src="/icons/battery.png" alt="Battery" className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />'
);

console.log('Done');
