const fs = require('fs');
const path = require('path');

function removeComments(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove single line comments (but not URLs like http:// and https://)
  content = content.replace(/(?<!:)\/\/.*/g, '');
  
  // Remove multi line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      removeComments(fullPath);
    }
  }
}

processDirectory('src/components');
processDirectory('src/store');
processDirectory('src/services');
processDirectory('src/app/api');

console.log('Removed comments from components, store, services, and app/api directories.');
