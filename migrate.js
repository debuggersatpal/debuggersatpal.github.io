import fs from 'fs';
import path from 'path';

// 1. Setup directories
fs.mkdirSync('src/portfolio/pages/projects', { recursive: true });
fs.mkdirSync('src/cms/pages', { recursive: true });

// 2. Move CMS files
const cmsFiles = fs.readdirSync('src/pages/me');
for (const file of cmsFiles) {
  fs.renameSync(`src/pages/me/${file}`, `src/cms/pages/${file}`);
}
fs.rmdirSync('src/pages/me');

// 3. Move Portfolio files
fs.renameSync('src/pages/404.astro', 'src/portfolio/pages/404.astro');
fs.renameSync('src/pages/index.astro', 'src/portfolio/pages/index.astro');
const projectFiles = fs.readdirSync('src/pages/projects');
for (const file of projectFiles) {
  fs.renameSync(`src/pages/projects/${file}`, `src/portfolio/pages/projects/${file}`);
}
fs.rmdirSync('src/pages/projects');

// 4. Update imports in Portfolio files (add one level of depth)
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace ../ with ../../
  content = content.replace(/\.\.\//g, '../../');
  fs.writeFileSync(filePath, content);
}

updateImports('src/portfolio/pages/404.astro');
updateImports('src/portfolio/pages/index.astro');
updateImports('src/portfolio/pages/projects/index.astro');

// Clean up old pages dir
fs.rmdirSync('src/pages');

console.log('Migration complete');
