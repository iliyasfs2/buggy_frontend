const fs = require('fs');

let content = fs.readFileSync('src/components/lesson/LessonPlayer.tsx', 'utf8');

content = content.replace('باتری تموم شد!', 'Out of Energy!');
content = content.replace('برای ادامه حل سوالات نیاز به شارژ باتری داری.', "You ran out of energy. Recharge to continue learning.");
content = content.replace('شارژ سریع رایگان', 'Free Quick Recharge');
content = content.replace('بازگشت به نقشه', 'Back to Roadmap');

fs.writeFileSync('src/components/lesson/LessonPlayer.tsx', content);
