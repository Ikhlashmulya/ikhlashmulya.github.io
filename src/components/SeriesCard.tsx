import type { CollectionEntry } from "astro:content";

interface Props {
  series: CollectionEntry<"series">;
}

export default function ({ series }: Props) {

  return (
      <a href={series.data.link}>
        <div class="space-y-1 flex flex-col items-start rounded-lg p-5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700">
          <div class="flex flex-col">
            <h2 class="text-xl text-black dark:text-white font-bold">{series.data.title}</h2>
            <p>{series.data.description}</p>
          </div>
        </div>
      </a>
  );
}
