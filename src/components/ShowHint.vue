<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ShowHint',
  setup() {
    const showHint = ref(false);
    const remainingHints = ref<number>(10);

    const toggleHint = () => {
      if (remainingHints.value > 0) {
        showHint.value = !showHint.value;
        if (showHint.value) remainingHints.value--;
      }
    };

    return {
      showHint,
      remainingHints,
      toggleHint,
    };
  },
});
</script>

<template>
  <button 
    @click="toggleHint" 
    class="flex items-center cursor-pointer ml-4 text-blue-900 font-semibold p-2 rounded">
    <img 
      src="../assets/icons/light-bulp.png" 
      alt="Hint" 
      class="mr-1 mb-2 w-5 h-5"
    >
    Hint ({{ remainingHints }})
  </button>
</template>
