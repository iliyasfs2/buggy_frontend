const fs = require('fs');
let file = 'src/store/useNavStore.ts';
let content = fs.readFileSync(file, 'utf8');

// remove require
content = content.replace('const { claimQuestApi } = require("@/services/progressApi");', '');

// add claimQuestApi to imports
if (!content.includes('claimQuestApi')) {
  content = content.replace(
    'import { fetchUserProgress } from "@/services/progressApi";',
    'import { fetchUserProgress, claimQuestApi } from "@/services/progressApi";'
  );
  content = content.replace(
    'import type { ProgressData } from "@/services/progressApi";',
    'import type { ProgressData } from "@/services/progressApi";\nimport { claimQuestApi } from "@/services/progressApi";'
  );
}

fs.writeFileSync(file, content);
