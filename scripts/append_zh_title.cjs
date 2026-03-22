const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = 'src/content/blog';

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('-zh.md'));

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const parsed = matter(content);
  
  if (parsed.data.title && !parsed.data.title.endsWith(' (中文)')) {
    parsed.data.title = parsed.data.title + ' (中文)';
    const newContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, newContent.trim() + "\n");
    console.log(`Updated title for ${file}`);
  }
}
