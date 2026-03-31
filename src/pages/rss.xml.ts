import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import postFilter from "@/utils/postFilter";
import { SITE } from "@/config";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt({ html: true });

export async function GET() {
  // Passing only 1 argument to postFilter evaluates publish rules but skips the
  // bilingual deduplication (which requires the allPosts array). 
  // This ensures BOTH English and Chinese versions are included in the RSS feed.
  const posts = await getCollection("blog", post => postFilter(post));
  const sortedPosts = getSortedPosts(posts, "modDatetime", false);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, id, filePath, body }) => {
      let cleanBody = body || "";

      // 1. Remove the Markdown TOC placeholder
      cleanBody = cleanBody.replace(/\* Will be replaced with the ToC[\s\S]*?\{:toc\}/gi, '');
      // 2. Completely remove the "References" or "参考文献" section and everything after it
      cleanBody = cleanBody.replace(/^#{1,6}\s*(References|参考文献)[\s\S]*$/mi, '');
      // 3. Remove any dangling footnote definitions at the bottom (e.g., [^1]: ...)
      cleanBody = cleanBody.replace(/^\[\^.*?\]:.*$/gm, '');
      // 4. Remove the inline footnote references (e.g., [^1]) from the paragraphs
      cleanBody = cleanBody.replace(/\[\^.*?\]/g, '');

      const htmlContent = sanitizeHtml(parser.render(cleanBody), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "span"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          "*": ["class", "style", "id"],
        },
      });

      return {
        link: getPath(id, filePath),
        title: data.title,
        description: htmlContent,
        pubDate: new Date(data.modDatetime ?? data.pubDatetime),
        content: htmlContent,
      };
    }),
  });
}
