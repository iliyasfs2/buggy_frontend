const fs = require('fs');
let file = 'src/components/shared/BatteryPopover.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '}: BatteryPopoverProps) {',
  '}: BatteryPopoverProps) {\n  const formattedTime = useBatteryTimer(15);'
);

fs.writeFileSync(file, content);
