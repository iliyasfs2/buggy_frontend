const fs = require('fs');

let apiFile = 'src/services/progressApi.ts';
let apiContent = fs.readFileSync(apiFile, 'utf8');

if (!apiContent.includes('export interface Quest {')) {
  apiContent = `export interface Quest {
  id: string;
  title: string;
  current: number;
  target: number;
  reward_bytes: number;
  claimed: boolean;
}\n\n` + apiContent;
}

apiContent = apiContent.replace(/any/g, 'Quest[]');
fs.writeFileSync(apiFile, apiContent);

let storeFile = 'src/store/useNavStore.ts';
let storeContent = fs.readFileSync(storeFile, 'utf8');
storeContent = storeContent.replace('dailyQuests: any[];', 'dailyQuests: import("@/services/progressApi").Quest[];');
storeContent = storeContent.replace('dailyQuests?.find((q: any) => q.id === "q1");', 'dailyQuests?.find((q: import("@/services/progressApi").Quest) => q.id === "q1");');
fs.writeFileSync(storeFile, storeContent);
