const fs = require('fs');
const content = fs.readFileSync('c:/Users/ajitm/HerNova/src/app/dashboard/page.js', 'utf8');

let braceLevel = 0;
let parenthesisLevel = 0;
let bracketLevel = 0;
let inString = null; // " or ' or `
let inComment = false; // single/multi-line
let inJSX = 0;

const lines = content.split('\n');

for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
  const line = lines[lineIdx];
  for (let charIdx = 0; charIdx < line.length; charIdx++) {
    const char = line[charIdx];
    const nextChar = line[charIdx + 1];
    
    // Simple comment check
    if (!inString) {
      if (char === '/' && nextChar === '/') {
        break; // Ignore rest of line
      }
      if (char === '/' && nextChar === '*') {
        inComment = true;
        charIdx++;
        continue;
      }
      if (inComment && char === '*' && nextChar === '/') {
        inComment = false;
        charIdx++;
        continue;
      }
    }
    
    if (inComment) continue;

    // Simple string escape check
    if (char === '\\') {
      charIdx++;
      continue;
    }

    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }

    if (char === '{') {
      braceLevel++;
    } else if (char === '}') {
      braceLevel--;
      if (braceLevel < 0) {
        console.log(`EXTRA CLOSING BRACE at line ${lineIdx + 1}: ${line.trim()}`);
        braceLevel = 0;
      }
    } else if (char === '(') {
      parenthesisLevel++;
    } else if (char === ')') {
      parenthesisLevel--;
      if (parenthesisLevel < 0) {
        console.log(`EXTRA CLOSING PARENTHESIS at line ${lineIdx + 1}: ${line.trim()}`);
        parenthesisLevel = 0;
      }
    } else if (char === '[') {
      bracketLevel++;
    } else if (char === ']') {
      bracketLevel--;
      if (bracketLevel < 0) {
        console.log(`EXTRA CLOSING BRACKET at line ${lineIdx + 1}: ${line.trim()}`);
        bracketLevel = 0;
      }
    }
  }
}

console.log(`FINAL STATUS:`);
console.log(`Braces level: ${braceLevel}`);
console.log(`Parenthesis level: ${parenthesisLevel}`);
console.log(`Bracket level: ${bracketLevel}`);
