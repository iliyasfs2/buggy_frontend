const fs = require('fs');

function cleanFile(filePath, removals) {
  let content = fs.readFileSync(filePath, 'utf8');
  removals.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  fs.writeFileSync(filePath, content);
}

// LessonPlayer.tsx
cleanFile('src/components/lesson/LessonPlayer.tsx', [
  { search: 'XCircle,', replace: '' },
  { search: 'Target,', replace: '' }
]);

// BugHuntRenderer.tsx
cleanFile('src/components/lesson/renderers/BugHuntRenderer.tsx', [
  { search: 'import { Terminal } from "lucide-react";\n', replace: '' }
]);

// FillBlankRenderer.tsx
cleanFile('src/components/lesson/renderers/FillBlankRenderer.tsx', [
  { search: '  CODE_PANEL_CLASSES,\n', replace: '' },
]);

// SingleChoiceRenderer.tsx
cleanFile('src/components/lesson/renderers/SingleChoiceRenderer.tsx', [
  { search: 'import { Terminal } from "lucide-react";\n', replace: '' }
]);

// TheoryRenderer.tsx
cleanFile('src/components/lesson/renderers/TheoryRenderer.tsx', [
  { search: 'import { Terminal } from "lucide-react";\n', replace: '' }
]);

// ChapterSection.tsx
cleanFile('src/components/path/ChapterSection.tsx', [
  { search: '  const isLocked = chapter.nodes[0]?.status === "locked";\n', replace: '' }
]);

// PathView.tsx
cleanFile('src/components/path/PathView.tsx', [
  { search: '  const addXp = useNavStore((state) => state.addXp);\n', replace: '' }
]);

console.log("Cleaned unused variables!");
