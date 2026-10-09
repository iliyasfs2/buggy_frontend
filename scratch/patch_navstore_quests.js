const fs = require('fs');
let content = fs.readFileSync('src/store/useNavStore.ts', 'utf8');

// add dailyQuests array to state
if (!content.includes('dailyQuests: any[];')) {
  content = content.replace(
    'activeCourse: string;\n  currentTrack: string;',
    'activeCourse: string;\n  currentTrack: string;\n  dailyQuests: any[];\n  dailyQuestsDate: string;'
  );
}

if (!content.includes('dailyQuests: [],')) {
  content = content.replace(
    'activeCourse: "javascript",\n      currentTrack: "JS",',
    'activeCourse: "javascript",\n      currentTrack: "JS",\n      dailyQuests: [],\n      dailyQuestsDate: "",'
  );
}

if (!content.includes('dailyQuests: data.daily_quests_state || [],')) {
  content = content.replace(
    'activeCourse: data.active_course ?? "javascript",\n            jsCount: completedChaptersCount * 5\n          };',
    'activeCourse: data.active_course ?? "javascript",\n            jsCount: completedChaptersCount * 5,\n            dailyQuests: typeof data.daily_quests_state === "string" ? JSON.parse(data.daily_quests_state) : data.daily_quests_state || [],\n            dailyQuestsDate: data.daily_quests_date || ""\n          };'
  );
}

fs.writeFileSync('src/store/useNavStore.ts', content);
