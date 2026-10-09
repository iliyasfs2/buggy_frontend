const fs = require('fs');

function replaceInFile(file, searchRegex, replacer) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(searchRegex, replacer);
  fs.writeFileSync(file, content);
}

// DesktopMetricBar
replaceInFile('src/components/layout/DesktopMetricBar.tsx', 
  /import {.*?selectStreakCount.*?} from "@\/store\/useNavStore";/,
  match => match.replace('selectStreakCount', 'selectStreakCount, selectHasCompletedToday')
);

replaceInFile('src/components/layout/DesktopMetricBar.tsx',
  /const streakCount = useNavStore\(selectStreakCount\);/,
  'const streakCount = useNavStore(selectStreakCount);\n  const hasCompletedToday = useNavStore(selectHasCompletedToday);'
);

replaceInFile('src/components/layout/DesktopMetricBar.tsx',
  /hasCompletedToday=\{false\}/,
  'hasCompletedToday={hasCompletedToday}'
);

// streak/page.tsx
replaceInFile('src/app/streak/page.tsx', 
  /import {.*?selectStreakCount.*?} from "@\/store\/useNavStore";/,
  match => match.replace('selectStreakCount', 'selectStreakCount, selectHasCompletedToday')
);

replaceInFile('src/app/streak/page.tsx',
  /const hasCompletedToday = false;/,
  'const hasCompletedToday = useNavStore(selectHasCompletedToday);'
);
