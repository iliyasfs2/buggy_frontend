const fs = require('fs');

let content;

// BytePopover
content = fs.readFileSync('src/components/shared/BytePopover.tsx', 'utf8');
content = content.replace('Coins, ', '');
content = content.replace(' Coins,', '');
content = content.replace('import { Coins } from "lucide-react";\n', '');
fs.writeFileSync('src/components/shared/BytePopover.tsx', content);

// StreakPopover
content = fs.readFileSync('src/components/shared/StreakPopover.tsx', 'utf8');
content = content.replace(', useState ', ' ');
content = content.replace(' Flame,', '');
content = content.replace('Flame, ', '');
content = content.replace('import { Flame } from "lucide-react";\n', '');
fs.writeFileSync('src/components/shared/StreakPopover.tsx', content);

// DesktopMetricBar
content = fs.readFileSync('src/components/layout/DesktopMetricBar.tsx', 'utf8');
content = content.replace('const jsCount = useNavStore(selectJsCount);\n', '');
content = content.replace(', selectJsCount', '');
fs.writeFileSync('src/components/layout/DesktopMetricBar.tsx', content);

// MobileHeader
content = fs.readFileSync('src/components/layout/MobileHeader.tsx', 'utf8');
content = content.replace(', selectJsCount', '');
fs.writeFileSync('src/components/layout/MobileHeader.tsx', content);
