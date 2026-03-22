import { getCollection, type CollectionEntry } from "astro:content";

export async function getSortedPosts() {
  const posts = (await getCollection("blog"))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()) as CollectionEntry<"blog">[];

  return posts; 
}
