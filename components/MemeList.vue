<script setup>
import { ref, onMounted } from "vue";
import { fetchMemes } from "@/utils/database";

const memes = ref([]);
const loading = ref(true);

// Fetch memes on component mount
const loadMemes = async () => {
  try {
    const data = await fetchMemes();
    memes.value = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
  } catch (error) {
    console.error("Error loading memes:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMemes();
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Memes</h1>
    <div v-if="loading">Loading...</div>
    <ul v-else>
      <li v-for="meme in memes" :key="meme.id" class="mb-4 border p-4 rounded-lg">
        <h3 class="font-semibold">{{ meme.title }}</h3>
        <p>😂 {{ meme.reactions?.laugh || 0 }} | 😐 {{ meme.reactions?.notFunny || 0 }}</p>
      </li>
    </ul>
  </div>
</template>
