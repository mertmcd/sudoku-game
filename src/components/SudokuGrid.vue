<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import CellState from "../models/CellState";

export default defineComponent({
  name: "SudokuGrid",
  props: {
    grid: {
      type: Array as PropType<CellState[][]>,
      required: true,
    },
    draftGrid: {
      type: Array as PropType<boolean[][][]>,
      required: true,
    },
  },
  setup(props) {
    const sudokuLevel = computed(() => 3);

    return {
      sudokuLevel,
      grid: props.grid,
      draftGrid: props.draftGrid,
    };
  },
});
</script>

<template>
  <div class="game-board mt-6">
    <!-- Iterating over sudokuLevel to create 3x3 grid blocks -->
    <template v-for="(_, block_i) in sudokuLevel">
      <template v-for="(_, block_j) in sudokuLevel">
        <!-- Each block is a 3x3 -->
        <div class="grid-square">
          <template v-for="(_, i) in sudokuLevel">
            <template v-for="(_, j) in sudokuLevel" :key="(i + '' + j)">
              <slot
                :i="block_i * sudokuLevel + i"
                :j="block_j * sudokuLevel + j"
                :cell="grid[block_i * sudokuLevel + i][block_j * sudokuLevel + j]"
                :draft="draftGrid[block_i * sudokuLevel + i][block_j * sudokuLevel + j]"
              ></slot>
            </template>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="postcss">
.my-grid {
  display: grid;
  @apply grid-rows-3;
  @apply grid-cols-3;
}

.game-board {
  @apply my-grid mx-auto border-4 border-blue-900;

  height: calc(100vw + 6px);
  width: 100vw;
  max-width: 462px;
  max-height: 462px;
}

.grid-square {
  @apply my-grid m-0 border-2 border-blue-900;
}
</style>
