const fs = require('fs');
let content = fs.readFileSync('src/store/useNavStore.ts', 'utf8');

// remove comments
content = content.replace(/\/\/.*$/gm, '');

// add rechargeBattery
if (!content.includes('rechargeBattery: () => void;')) {
  content = content.replace('setByteBalance: (count: number) => void;', 'setByteBalance: (count: number) => void;\n  rechargeBattery: () => void;');
}

if (!content.includes('rechargeBattery: async () => {')) {
  content = content.replace('switchCourse: (course: string) => set({ activeCourse: course }),', `switchCourse: (course: string) => set({ activeCourse: course }),\n      rechargeBattery: async () => {\n        try {\n          const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? \`\${process.env.NEXT_PUBLIC_API_URL}/progress/recharge-battery\` : "http://localhost:8000/progress/recharge-battery", { method: "POST" });\n          if (res.ok) {\n            const data = await res.json();\n            set({ batteryCount: data.battery });\n          }\n        } catch(e) {}\n      },`);
}

fs.writeFileSync('src/store/useNavStore.ts', content);
