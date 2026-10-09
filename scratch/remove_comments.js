const fs = require('fs');

const files = [
  'src/components/shared/StreakPopover.tsx',
  'src/components/shared/BytePopover.tsx',
  'src/components/shared/CoursePopover.tsx',
  'src/app/streak/page.tsx',
  'src/app/bytes/page.tsx',
  'src/app/courses/page.tsx',
  'src/components/layout/MobileHeader.tsx',
  'src/components/layout/DesktopMetricBar.tsx',
  'src/components/path/PathView.tsx',
  'src/components/lesson/LessonPlayer.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\/\/.*$/gm, '');
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  fs.writeFileSync(file, content);
  console.log('Removed comments from', file);
});
