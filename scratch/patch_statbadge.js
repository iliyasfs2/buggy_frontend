const fs = require('fs');
let content = fs.readFileSync('src/components/shared/StatBadge.tsx', 'utf8');

content = content.replace(
  'compact?: boolean;\n  className?: string;\n}',
  'compact?: boolean;\n  className?: string;\n  onClick?: () => void;\n}'
);

content = content.replace(
  'className = ""\n}: StatBadgeProps): ReactElement {',
  'className = "",\n  onClick\n}: StatBadgeProps): ReactElement {'
);

content = content.replace(
  '<div\n      className={`inline-flex items-center',
  '<div\n      onClick={onClick}\n      role={onClick ? "button" : undefined}\n      className={`inline-flex items-center ${onClick ? "cursor-pointer active:scale-95 transition-transform" : ""}'
);

fs.writeFileSync('src/components/shared/StatBadge.tsx', content);
