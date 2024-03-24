import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";
import { SITE } from "@config";

const getSortedPosts = (
  posts: CollectionEntry<"blog">[],
  descBy: "pubDatetime" | "modDatetime" = SITE.descBy
) => {
  return posts
    .filter(postFilter)
    .sort((a: CollectionEntry<"blog">, b: CollectionEntry<"blog">): number => {
      const postOrder = (post: CollectionEntry<"blog">): number =>
        Math.floor(
          new Date(post.data[descBy] ?? post.data.pubDatetime).getTime() / 1000
        );

      return postOrder(b) - postOrder(a);
    });
};

export default getSortedPosts;
