<script setup>
import { ref } from "vue";
import { addMeme } from "@/utils/database";

const title = ref("");
const error = ref("");

const submitMeme = async () => {
  if (!title.value) {
    error.value = "Title is required";
    return;
  }

  try {
    await addMeme({ title: title.value, reactions: { laugh: 0, notFunny: 0 }, comments: [] });
    title.value = ""; // Clear the form
    alert("Meme added successfully!");
  } catch (err) {
    console.error("Error adding meme:", err);
    error.value = err.message;
  }
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Add a Meme</h1>
    <form @submit.prevent="submitMeme">
      <input
        v-model="title"
        type="text"
        placeholder="Enter meme title"
        class="border p-2 w-full mb-2"
      />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add Meme</button>
    </form>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>
