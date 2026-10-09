const fs = require('fs');
let file = 'src/services/progressApi.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('daily_quests_date')) {
  content = content.replace(
    'unlocked_nodes: string[];\n}',
    'unlocked_nodes: string[];\n  daily_quests_date?: string;\n  daily_quests_state?: any;\n}'
  );
  fs.writeFileSync(file, content);
}
