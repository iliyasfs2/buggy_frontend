const fs = require('fs');
let file = 'src/services/progressApi.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http:\nexport const fetchUserProgress = async (): Promise<ProgressData> => {',
  'const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";\n\nexport const fetchUserProgress = async (): Promise<ProgressData> => {'
);
fs.writeFileSync(file, content);
