const fs = require('fs');
const path = 'c:/Users/ajitm/HerNova/src/app/dashboard/page.js';
let content = fs.readFileSync(path, 'utf8');

// Match from `{/* Modal: FinHer Score Improvement Tips */}` up to the next `auto_awesome` button closing div
const regex = /\{\/\*\s*Modal:\s*FinHer\s*Score\s*Improvement\s*Tips\s*\*\/\}\s*\{tipsOpen[\s\S]*?auto_awesome<\/span>\s*<\/button>\s*<\/div>/;

const match = content.match(regex);
if (match) {
  console.log("Found match!", match[0].substring(0, 150) + "..." + match[0].substring(match[0].length - 150));
  const newContent = content.replace(regex, '');
  fs.writeFileSync(path, newContent, 'utf8');
  console.log("Successfully replaced and saved!");
} else {
  console.log("Regex match not found!");
}
