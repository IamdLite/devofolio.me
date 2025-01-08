<template>
  <div
    class="flex flex-col p-4 border rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
  >
    <!-- Meme Title -->
    <p class="mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">
      {{ meme.title }}
    </p>

    <!-- Meme Image -->
    <img
      :src="meme.image"
      :alt="meme.title"
      class="object-cover w-full h-auto mb-4 rounded-lg cursor-pointer"
      @click="openImageModal"
    />

    <!-- Reaction Buttons -->
    <div
      class="flex items-center justify-between text-gray-500 dark:text-gray-400"
    >
      <button
        class="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        @click="react('laugh')"
      >
        <span>😂</span>
        <span>{{ state.reactions.laugh }}</span>
      </button>

      <button
        class="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        @click="react('notFunny')"
      >
        <span>😐</span>
        <span>{{ state.reactions.notFunny }}</span>
      </button>

      <button
        class="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        @click="toggleComments"
      >
        <span>💬</span>
        <span>{{ state.comments.length }}</span>
      </button>
    </div>

    <!-- Comments Section -->
    <div v-if="showComments" class="mt-4">
      <ul class="mb-2">
        <li
          v-for="(comment, index) in state.comments"
          :key="index"
          class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <img
            src="/default-avatar.png"
            alt="Avatar"
            class="w-6 h-6 rounded-full"
          />
          <span class="font-medium">Random human:</span>
          <span>{{ comment }}</span>
        </li>
      </ul>

      <div class="flex items-center space-x-2">
        <input
          v-model="newComment"
          type="text"
          placeholder="Add a comment..."
          class="flex-1 px-3 py-1 text-sm border rounded-full bg-gray-50 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
          @keyup.enter="postComment"
        />
        <button
          class="p-2 text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          @click="postComment"
        >
          💬
        </button>
      </div>
    </div>
  </div>

  <!-- Image Zoom Modal -->
  <transition name="fade">
    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click="closeImageModal"
    >
      <img
        :src="meme.image"
        alt="Zoomed Image"
        class="object-contain max-w-full max-h-full"
        @click.stop
      />
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { getCardState, updateCardState } from "@/utils/database";

defineProps({
  meme: {
    type: Object,
    required: true,
  },
});

const state = reactive({
  reactions: { laugh: 10, notFunny: 1 },
  comments: [],
});

const newComment = ref("");
const showComments = ref(false);
const isImageModalOpen = ref(false);

// Fetch the initial state for the meme
onMounted(async () => {
  try {
    const fetchedState = await getCardState(meme.id);
    state.reactions = fetchedState.reactions || { laugh: 10, notFunny: 1 };
    state.comments = fetchedState.comments || [];
  } catch (error) {
    console.error("Error fetching card state:", error);
  }
});

// Toggle visibility of the comments section
const toggleComments = () => {
  showComments.value = !showComments.value;
};

// Handle reactions
const react = async (type) => {
  try {
    state.reactions[type]++;
    await updateCardState(meme.id, { reactions: state.reactions });
  } catch (error) {
    console.error(`Error updating reaction (${type}):`, error);
  }
};

// Handle posting new comments
const postComment = async () => {
  const trimmedComment = newComment.value.trim();
  if (trimmedComment) {
    try {
      state.comments.push(trimmedComment);
      await updateCardState(meme.id, { comments: state.comments });
      newComment.value = ""; // Clear input
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }
};

// Open Image Modal
const openImageModal = () => {
  isImageModalOpen.value = true;
};

// Close Image Modal
const closeImageModal = () => {
  isImageModalOpen.value = false;
};
</script>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: scale(1.1);
}

/* Image Modal fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Modal Image */
.fixed {
  z-index: 999;
}

.object-contain {
  object-fit: contain;
}

/* Prevent vertical padding issues by letting image scale within limits */
.object-cover {
  object-fit: cover;
}
</style>

