const fs = require('fs');
let file = 'src/components/shared/BatteryPopover.tsx';
let content = fs.readFileSync(file, 'utf8');

// add hook import
if (!content.includes('const formattedTime = useBatteryTimer(15);')) {
  content = content.replace(
    'export function BatteryPopover({ currentBattery, isOpen, onClose, onRefillWithBytes, onRefillWithPractice }: BatteryPopoverProps) {',
    'export function BatteryPopover({ currentBattery, isOpen, onClose, onRefillWithBytes, onRefillWithPractice }: BatteryPopoverProps) {\n  const formattedTime = useBatteryTimer(15);'
  );
  
  content = content.replace(
    '<span className="text-xs font-bold font-mono">Next refill: 15:24</span>',
    '<span className="text-xs font-bold font-mono">Next refill: {currentBattery === 5 ? "MAX" : formattedTime}</span>'
  );
}

fs.writeFileSync(file, content);
