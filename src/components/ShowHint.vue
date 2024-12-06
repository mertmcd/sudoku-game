<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import CellState from '../models/CellState';


export default defineComponent({
  name: 'ShowHint',
  emits: ['judge-board', 'update-hint-points'],

  props: {
    grid : {
      type: Array as PropType<CellState[][]>,
      required: true,
    },
    selected: {
      type: Array as PropType<number[]>,
    },
  },

  setup(props, { emit, expose }) {
    const showHint = ref(false);
    const remainingHints = ref<number>(10);
    const hintPenalty = ref<number>(3);

    const toggleHint = (): void => {
      if (remainingHints.value === 0) {
        return;
      }

      if (!props.selected || props.selected[0] === -1 || props.selected[1] === -1) return;
      
      const cell = props.grid[props.selected[0]][props.selected[1]];

      if (cell?.cellValue !== null) return;

      cell.cellValue = cell.correctValue;

      emit('update-hint-points', hintPenalty.value);
      hintPenalty.value++;
      remainingHints.value--;

      emit('judge-board');
    };

    const resetHints = (): void => {
      remainingHints.value = 10;
      hintPenalty.value = 3;
    }

    expose({
      resetHints,
    });

    return {
      showHint,
      remainingHints,
      toggleHint,
      resetHints
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
