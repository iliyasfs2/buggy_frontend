const fs = require('fs');
let file = 'src/app/battery/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove comments
content = content.replace(/\/\/.*$/gm, '');
content = content.replace(/\/\*[\s\S]*?\*\//g, '');

// add hook import
if (!content.includes('useBatteryTimer')) {
  content = content.replace(
    'import { useNavStore, selectBatteryCount, selectByteBalance } from "@/store/useNavStore";',
    'import { useNavStore, selectBatteryCount, selectByteBalance } from "@/store/useNavStore";\nimport { useBatteryTimer } from "@/hooks/useBatteryTimer";'
  );
  
  content = content.replace(
    'const setByteBalance = useNavStore((state) => state.setByteBalance);',
    'const setByteBalance = useNavStore((state) => state.setByteBalance);\n  const formattedTime = useBatteryTimer(15);'
  );
  
  content = content.replace(
    '<span className="text-base font-black tracking-widest">15:24</span>',
    '<span className="text-base font-black tracking-widest font-mono">{currentBattery === 5 ? "MAX" : formattedTime}</span>'
  );
}

fs.writeFileSync(file, content);
