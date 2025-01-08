<script setup>
import MemeCard from "~/components/cards/MemeCard.vue";

definePageMeta({
  title: "My Memes",
  description: "Promise to react if you laugh. Check out my award-winning meme Lord certificate!",
});

// Fetch memes from the body of the JSON file
const { pending, data: memesFile } = await useLazyAsyncData(
  "memes",
  () => queryContent("/memes/meme").findOne() // Fetch the single JSON file
);

// Extract memes data from the `body` key
const allMemes = computed(() => memesFile.value?.body || []);

// Group memes into categories
const spaceMemes = computed(() =>
  allMemes.value.filter((meme) => meme.category === "space")
);
const cybersecurityMemes = computed(() =>
  allMemes.value.filter((meme) => meme.category === "cybersecurity")
);
const miscellaneousMemes = computed(() =>
  allMemes.value.filter((meme) => meme.category === "miscellaneous")
);

// Reaction and comment logic
const updateReaction = async (memeId, type) => {
  const meme = allMemes.value.find((meme) => meme.id === memeId);
  if (meme) {
    meme.reactions[type]++;
    console.log(`Reaction updated: ${type} for meme ID ${memeId}`);
    // Optionally save the updated reaction count to a backend or database here
  }
};

const postComment = async (memeId, comment) => {
  const meme = allMemes.value.find((meme) => meme.id === memeId);
  if (meme) {
    meme.comments.push(comment);
    console.log(`Comment posted: "${comment}" for meme ID ${memeId}`);
    // Optionally save the updated comments to a backend or database here
  }
};
</script>

<template>
  <article>
    <!-- Page Title -->
    <h1 class="mb-4 text-3xl font-bold text-left">My Memes</h1>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      Yeah, 'can be a god-level memer too when I want. Don't say I didn't show you! *
      <a 
        href="https://drive.google.com/file/d/1UgaO8M0gdu_amJlWQAXAX7LKW5tbPsXg/view?usp=drive_link" 
        target="_blank" 
        class="text-blue-500 underline hover:text-blue-400">
        dramatic music
      </a> *
    </p>

    <!-- Meme Sections -->
    <section>
      <!-- Space Memes -->
      <h2 class="mb-4 text-2xl font-semibold">Space</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemeCard
          v-for="meme in spaceMemes"
          :key="meme.id"
          :meme="meme"
          @react="updateReaction"
          @comment="postComment"
        />
      </div>

      <!-- Cybersecurity Memes -->
      <h2 class="mt-8 mb-4 text-2xl font-semibold">Cybersecurity</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemeCard
          v-for="meme in cybersecurityMemes"
          :key="meme.id"
          :meme="meme"
          @react="updateReaction"
          @comment="postComment"
        />
      </div>

      <!-- Miscellaneous Memes -->
      <h2 class="mt-8 mb-4 text-2xl font-semibold">Miscellaneous</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemeCard
          v-for="meme in miscellaneousMemes"
          :key="meme.id"
          :meme="meme"
          @react="updateReaction"
          @comment="postComment"
        />
      </div>
    </section>
  </article>
</template>
