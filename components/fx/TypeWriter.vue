<script setup>
// Types each phrase, pauses, deletes it, moves on.
const props = defineProps({
  phrases: { type: Array, required: true },
  speed: { type: Number, default: 55 },
  pause: { type: Number, default: 1800 },
});

const text = ref(props.phrases[0]);
let timer;

onMounted(() => {
  let i = 0;
  let pos = text.value.length;
  let deleting = true;
  const tick = () => {
    if (deleting) {
      pos--;
      if (pos <= 0) {
        deleting = false;
        i = (i + 1) % props.phrases.length;
      }
    } else {
      pos++;
    }
    text.value = props.phrases[i].slice(0, Math.max(pos, 0));
    let delay = deleting ? props.speed / 2 : props.speed;
    if (!deleting && pos === props.phrases[i].length) {
      deleting = true;
      delay = props.pause;
    }
    timer = setTimeout(tick, delay);
  };
  timer = setTimeout(tick, props.pause);
});
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <span class="blink" aria-live="off">{{ text }}</span>
</template>
