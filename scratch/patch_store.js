const fs = require('fs');
let content = fs.readFileSync('src/store/useNavStore.ts', 'utf8');

content = content.replace(
  'setByteBalance: (count: number) => set({ byteBalance: count }),\n      syncNav:',
  'setByteBalance: (count: number) => set({ byteBalance: count }),\n      switchCourse: (course: string) => set({ activeCourse: course }),\n      syncNav:'
);

content = content.replace(
  'batteryCount: data.battery,\n            jsCount:',
  'batteryCount: data.battery,\n            activeCourse: data.active_course ?? "javascript",\n            jsCount:'
);

if (!content.includes('selectActiveCourse')) {
    content += '\nexport const selectActiveCourse = (state: NavState): string => state.activeCourse;';
}

fs.writeFileSync('src/store/useNavStore.ts', content);
