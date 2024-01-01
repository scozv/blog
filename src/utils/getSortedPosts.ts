import type { CollectionEntry } from "astro:content";

const getSortedPosts = (
  posts: CollectionEntry<"blog">[],
  descBy: "pubDatetime" | "modDatetime" = "pubDatetime"
) => {
  return posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data[descBy] ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data[descBy] ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedPosts;
