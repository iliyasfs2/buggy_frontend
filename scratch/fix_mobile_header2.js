const fs = require('fs');
let file = 'src/components/layout/MobileHeader.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('selectBatteryCount,\n  selectJsCount\n} from "@/store/useNavStore";', 'selectBatteryCount\n} from "@/store/useNavStore";');
fs.writeFileSync(file, content);
