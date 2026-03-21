import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";
import { SITE } from "@/config";

const getSortedPosts = (
  posts: CollectionEntry<"blog">[],
  descBy: "pubDatetime" | "modDatetime" | undefined = SITE.descBy as "pubDatetime" | "modDatetime" | undefined
) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(descBy === "modDatetime" ? (b.data.modDatetime ?? b.data.pubDatetime) : b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(descBy === "modDatetime" ? (a.data.modDatetime ?? a.data.pubDatetime) : a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedPosts;