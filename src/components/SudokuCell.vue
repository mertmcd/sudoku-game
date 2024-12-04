<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import CellState from '../models/CellState';

export default defineComponent({
  name: 'SudokuCell',
  props: {
    cell: {
      type: Object as PropType<CellState>,
      required: true,
    },
    draft: {
      type: Array as PropType<boolean[]>,
      required: true,
    },
    highlightedValue: {
      type: Number as PropType<number | null>,
    },
    isSelected: Boolean,
  },
  setup(props, { emit }) {
    // Computed property to determine if draft values should be displayed
    const showDraftValues = computed(() => {
      return props.cell.cellValue === null && props.draft.some(v => v);
    });

    // Event emitter for cell select action
    const onCellSelect = () => {
      emit('onCellSelect');
    };

    return {
      showDraftValues,
      onCellSelect,
    };
  },
});
</script>

<template>
  <div
    @click="onCellSelect"
    :class="{
      cell: true,
      filled: cell.cellValue !== null,
      highlighted: highlightedValue !== null && cell.cellValue === highlightedValue,
      selected: isSelected,
      wrong: cell.isWrong,
      prefilled: cell.isPrefilled,
      'grid grid-cols-3 grid-rows-3': showDraftValues,
      'grid grid-cols-4 grid-rows-4': draft.length === 15 && showDraftValues,
    }"
  >
    <!-- Draft Values Display -->
    <template v-if="showDraftValues">
      <span
        class="text-xs italic font-semibold"
        :class="{ invisible: !v, highlighted: (n + 1 === highlightedValue) }"
        v-for="(v, n) in draft"
        :key="n"
      >{{ n + 1 }}</span>
    </template>

    <!-- Cell Value Display -->
    <template v-else>{{ cell.cellValue }}</template>
  </div>
</template>

<style lang="postcss">
.cell {
  @apply text-3xl;
  line-height: 3.25rem;

  width: 11vw;
  height: 11vw;
  max-height: 50px;
  max-width: 50px;
  @apply border-2 border-blue-900;
  @apply font-medium;
  @apply cursor-pointer;
}

.cell.selected {
  @apply bg-gray-200;
  @apply border-2 border-gray-300;
}

.cell.filled {
  @apply text-indigo-600;
}

.cell.highlighted {
  @apply bg-blue-300;
}

.cell span.highlighted {
  @apply bg-blue-300;
}

.cell.prefilled {
  color: black;
}

.cell.wrong {
  @apply text-indigo-100;
  @apply bg-red-500;
}

.cell.wrong.highlighted {
  @apply text-black;
  @apply bg-red-500;
  @apply border-2 border-blue-300;
}
</style>
