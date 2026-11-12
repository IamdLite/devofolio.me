<script setup>
definePageMeta({
  title: "Blog",
  description: "Writing on space, cybersecurity and technology, published on Medium.",
});

// Plain-text teaser cut at a word boundary.
function excerpt(html, max = 200) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, text.lastIndexOf(" ", max))}…`;
}

// Medium feed via rss2json, with local content/blog entries as a fallback if the feed is unreachable.
const { data: posts, pending } = await useLazyAsyncData("posts", async () => {
  try {
    const res = await $fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@iamdlite");
    return res.items.map((post) => ({
      id: post.guid,
      title: post.title,
      url: post.link,
      tags: post.categories ?? [],
      image: post.thumbnail || post.content.match(/<img[^>]+src="([^"]+)"/)?.[1] || "",
      date: post.pubDate.split(" ")[0],
      excerpt: excerpt(post.description),
      minutes: Math.max(1, Math.round(post.content.replace(/<[^>]*>/g, " ").split(/\s+/).length / 230)),
    }));
  } catch {
    const local = await queryContent("/blog").sort({ published_on: -1 }).find();
    return local.map((p) => ({ id: p._path, title: p.title, url: p.url, tags: p.tags ?? [], image: p.image, date: p.published_on, excerpt: p.description }));
  }
});
</script>

<template>
  <div class="container-cy py-14">
    <header class="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div class="max-w-3xl">
        <p class="kicker mb-3">// tail -f ~/blog</p>
        <h1 class="h-display text-4xl sm:text-5xl"><ScrambleText text="Notes from the field" /></h1>
        <p class="mt-4 text-lg text-dim">
          I learn by sharing what taught me, so you can learn it faster. Space, cybersecurity and tech in general, published on Medium.
        </p>
      </div>
      <a href="https://iamdlite.medium.com/" target="_blank" rel="noopener" class="btn-ghost"><Icon name="simple-icons:medium" /> Follow on Medium</a>
    </header>

    <div v-if="pending || !posts?.length" class="rounded-[2rem] border border-line bg-panel p-5">
      <div class="grid aspect-video animate-pulse place-items-center rounded-[1.4rem] bg-black font-mono text-sm text-[#00ff9c]">
        {{ pending ? "tuning in…" : "no signal" }}
      </div>
    </div>
    <TvCarousel v-else :items="posts" label="Articles" />
  </div>
</template>
