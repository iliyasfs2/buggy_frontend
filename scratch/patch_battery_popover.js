const fs = require('fs');
let file = 'src/components/shared/BatteryPopover.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove comments
content = content.replace(/\/\/.*$/gm, '');
content = content.replace(/\/\*[\s\S]*?\*\//g, '');

// add hook import
if (!content.includes('useBatteryTimer')) {
  content = content.replace(
    'import { AnimatePresence, motion } from "framer-motion";',
    'import { AnimatePresence, motion } from "framer-motion";\nimport { useBatteryTimer } from "@/hooks/useBatteryTimer";'
  );
  
  content = content.replace(
    'export function BatteryPopover({ currentBattery, isOpen, onClose, onRefillWithBytes, onRefillWithPractice }: BatteryPopoverProps) {',
    'export function BatteryPopover({ currentBattery, isOpen, onClose, onRefillWithBytes, onRefillWithPractice }: BatteryPopoverProps) {\n  const formattedTime = useBatteryTimer(15);'
  );
  
  content = content.replace(
    '<span className="text-[13px] font-bold text-emerald-400">Next refill: 15:24</span>',
    '<span className="text-[13px] font-bold text-emerald-400 font-mono">Next refill: {currentBattery === 5 ? "MAX" : formattedTime}</span>'
  );
}

fs.writeFileSync(file, content);
