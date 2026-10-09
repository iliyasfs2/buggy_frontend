const fs = require('fs');
let file = 'src/services/progressApi.ts';
let content = fs.readFileSync(file, 'utf8');

// remove duplicate
content = content.replace('daily_quests_state: Quest[][];\n', '');
content = content.replace('daily_quests_state?: Quest[];', 'daily_quests_state: import("@/services/progressApi").Quest[];');

fs.writeFileSync(file, content);
