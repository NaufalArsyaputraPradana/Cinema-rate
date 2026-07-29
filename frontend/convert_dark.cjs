const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { regex: /\bbg-slate-900\b/g, replacement: 'dark:bg-slate-900 bg-slate-50' },
  { regex: /\bbg-slate-800\b/g, replacement: 'dark:bg-slate-800 bg-white' },
  { regex: /\btext-white\b/g, replacement: 'dark:text-white text-slate-900' },
  { regex: /\btext-slate-300\b/g, replacement: 'dark:text-slate-300 text-slate-600' },
  { regex: /\btext-slate-400\b/g, replacement: 'dark:text-slate-400 text-slate-500' },
  { regex: /\bborder-slate-700\b/g, replacement: 'dark:border-slate-700 border-slate-300' },
  { regex: /\bborder-slate-800\b/g, replacement: 'dark:border-slate-800 border-slate-200' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      replacements.forEach(r => {
        // Prevent double replacement if dark: is already there
        // this is a naive replacement but works for our controlled codebase
        content = content.replace(r.regex, (match, offset, string) => {
          const prev = string.slice(Math.max(0, offset - 5), offset);
          if (prev.includes('dark:')) return match;
          return r.replacement;
        });
      });
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDirectory(directoryPath);
