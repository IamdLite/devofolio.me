<script setup>
const open = useTerminalOpen();
const term = ref(null);

watch(open, (v) => v && nextTick(() => term.value?.focus()));
onKeyStroke("Escape", () => (open.value = false));
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0 translate-y-4"
      leave-to-class="opacity-0 translate-y-4"
      enter-active-class="transition duration-200"
      leave-active-class="transition duration-150"
    >
      <div
        v-if="open"
        class="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[38rem]"
        role="dialog"
        aria-label="Terminal"
      >
        <CyberTerminal ref="term" autofocus height="h-[min(26rem,60vh)]" @exit="open = false">
          <template #actions>
            <button class="ml-auto text-[#7f95a5] hover:text-[#00ff9c]" aria-label="Close terminal" @click="open = false">
              <Icon name="ph:x-bold" />
            </button>
          </template>
        </CyberTerminal>
      </div>
    </Transition>
  </Teleport>
</template>
