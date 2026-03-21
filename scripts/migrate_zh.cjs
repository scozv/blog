const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const zhDir = '_posts/zh';
const blogDir = 'src/content/blog';

if (!fs.existsSync(zhDir)) {
  console.log("No zh dir found.");
  process.exit(0);
}

const files = fs.readdirSync(zhDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const zhFilePath = path.join(zhDir, file);
  const content = fs.readFileSync(zhFilePath, 'utf8');
  
  // Parse frontmatter
  const parsed = matter(content);
  
  // Check if there is an English counterpart to steal the slug from, or generate one
  let newSlug = "";
  const enFilePath = path.join(blogDir, file);
  
  if (fs.existsSync(enFilePath)) {
    const enContent = fs.readFileSync(enFilePath, 'utf8');
    const enParsed = matter(enContent);
    if (enParsed.data.slug) {
      newSlug = enParsed.data.slug + "-zh";
    }
  }
  
  // Clean up content
  let body = parsed.content;
  body = body.replace(/{% include JB\/setup %}/g, '');
  body = body.replace(/<!--more-->/g, '');
  body = body.replace(/<div class="post-content lang zh-cn">/g, '');
  body = body.replace(/<\/div>/g, '');
  
  // Fix frontmatter for Astro
  const newData = { ...parsed.data };
  delete newData.layout; // layout not needed in Astro content collections
  if (newSlug) {
      newData.slug = newSlug;
  } else if (!newData.slug) {
      // Fallback if no english equivalent and no slug in zh
      newData.slug = file.replace('.md', '') + "-zh";
  }
  
  // Set explicit date if missing (using filename)
  if (!newData.pubDatetime) {
     const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
     if (dateMatch) {
         newData.pubDatetime = new Date(dateMatch[1] + "T00:00:00Z");
     }
  }

  const newContent = matter.stringify(body, newData);
  
  const newFilename = file.replace('.md', '-zh.md');
  const destPath = path.join(blogDir, newFilename);
  
  fs.writeFileSync(destPath, newContent.trim() + "\n");
  console.log(`Migrated ${file} to ${newFilename}`);
}
