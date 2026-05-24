const fs = require('fs');
const path = require('path');

const dirsToSearch = ['src/pages', 'src/components', 'src'];
let files = [];

dirsToSearch.forEach(dir => {
  const fullDir = path.join(__dirname, '..', dir);
  if (fs.existsSync(fullDir)) {
    const dirFiles = fs.readdirSync(fullDir)
      .filter(f => f.endsWith('.tsx') || f.endsWith('.css'))
      .map(f => path.join(fullDir, f));
    files = files.concat(dirFiles);
  }
});

files.forEach(filePath => {
  if (fs.statSync(filePath).isDirectory()) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const replacements = [
    { regex: /#0B0F19/g, replacement: '#050014' },
    { regex: /#161B22/g, replacement: '#12092a' },
    { regex: /#0f172a/g, replacement: '#050014' } // Also replace the LandingPage dark bg
  ];

  let original = content;
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
