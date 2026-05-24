const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Dashboard.tsx',
  'src/pages/AdminDashboard.tsx',
  'src/pages/Registrations.tsx',
  'src/pages/EventsGrid.tsx',
  'src/pages/EventDetail.tsx',
  'src/pages/EventStats.tsx',
  'src/pages/CreateEvent.tsx',
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const replacements = [
    { regex: /bg-slate-50(?! dark:bg-)/g, replacement: 'bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300' },
    { regex: /bg-white(?! dark:bg-)/g, replacement: 'bg-white dark:bg-[#161B22] transition-colors duration-300' },
    { regex: /text-slate-900(?! dark:text-)/g, replacement: 'text-slate-900 dark:text-white' },
    { regex: /text-slate-800(?! dark:text-)/g, replacement: 'text-slate-800 dark:text-slate-100' },
    { regex: /text-slate-700(?! dark:text-)/g, replacement: 'text-slate-700 dark:text-slate-200' },
    { regex: /text-slate-600(?! dark:text-)/g, replacement: 'text-slate-600 dark:text-slate-300' },
    { regex: /text-slate-500(?! dark:text-)/g, replacement: 'text-slate-500 dark:text-slate-400' },
    { regex: /border-slate-100(?! dark:border-)/g, replacement: 'border-slate-100 dark:border-slate-800/60' },
    { regex: /border-slate-200(?! dark:border-)/g, replacement: 'border-slate-200 dark:border-slate-700' },
    { regex: /border-slate-50(?! dark:border-)/g, replacement: 'border-slate-50 dark:border-slate-800/40' },
    { regex: /shadow-sm(?! dark:shadow-none)/g, replacement: 'shadow-sm dark:shadow-none' },
    { regex: /bg-slate-100(?! dark:bg-)/g, replacement: 'bg-slate-100 dark:bg-slate-800 transition-colors duration-300' },
    { regex: /hover:bg-slate-50(?! dark:hover:bg-)/g, replacement: 'hover:bg-slate-50 dark:hover:bg-[#1c2333]' },
  ];

  let original = content;
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`No changes needed for ${file}`);
  }
});
