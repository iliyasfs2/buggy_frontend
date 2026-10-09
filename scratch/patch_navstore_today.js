const fs = require('fs');
let file = 'src/store/useNavStore.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('selectHasCompletedToday')) {
  content += '\nexport const selectHasCompletedToday = (state: NavState) => {\n  const q1 = state.dailyQuests?.find((q: any) => q.id === "q1");\n  return q1 ? q1.current > 0 : false;\n};';
  fs.writeFileSync(file, content);
}
