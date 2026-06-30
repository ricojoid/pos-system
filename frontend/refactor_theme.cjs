const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.jsx'));

const replacements = [
  { regex: /bg-gray-800/g, replacement: 'bg-white' },
  { regex: /bg-gray-900/g, replacement: 'bg-gray-50' },
  { regex: /text-gray-300/g, replacement: 'text-gray-700' },
  { regex: /text-gray-400/g, replacement: 'text-gray-500' },
  { regex: /text-white/g, replacement: 'text-slate-900' },
  { regex: /border-gray-700/g, replacement: 'border-gray-200' },
  { regex: /border-gray-800/g, replacement: 'border-gray-100' },
  { regex: /bg-\[\#0a0e1a\]/g, replacement: 'bg-slate-50' },
  { regex: /bg-\[\#0f172a\]/g, replacement: 'bg-white' },
  { regex: /bg-blue-500\/20/g, replacement: 'bg-emerald-50' },
  { regex: /text-blue-400/g, replacement: 'text-emerald-600' },
  { regex: /border-blue-500\/30/g, replacement: 'border-emerald-100' },
];

let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Finished updating ${changedCount} files.`);
