import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const postFilter = (
  post: CollectionEntry<"blog">,
  index: number,
  allPosts: CollectionEntry<"blog">[]
) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(post.data.pubDatetime).getTime() - SITE.scheduledPostMargin;

  const isDraftOrFuture = post.data.draft || (!import.meta.env.DEV && !isPublishTimePassed);
  
  if (isDraftOrFuture) return false;

  // Bilingual deduplication logic
  const isZh = post.id.endsWith("-zh");
  if (isZh) {
    const baseId = post.id.replace(/-zh$/, "");
    const hasEnglishVersion = allPosts.some(p => p.id === baseId);
    if (hasEnglishVersion) {
      return false; // Hide Chinese version if English version exists
    }
  }

  return true;
};

export default postFilter;
