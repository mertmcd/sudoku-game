<script lang="ts">
import { ref, computed, defineComponent, onUpdated } from 'vue';
import type { Ref } from 'vue';
import CellState from './models/CellState';
import SudokuCell from './components/SudokuCell.vue';
import SudokuGrid from './components/SudokuGrid.vue';
import CountupTimer from './components/CountupTimer.vue';
import ShowHint from './components/ShowHint.vue';
import PuzzleSet from './puzzles/SudokuPuzzleSet.json';
import PuzzleAnswers from './puzzles/PuzzleAnswers.json';
import ConfettiEffect from './components/Confetti.vue';
import './assets/main.css';

type SudokuLevel = 'beginner' | 'intermediate' | 'hard' | 'expert';
type GridSize = 9;

export default defineComponent({
  name: 'App',
  components: {
    SudokuCell,
    SudokuGrid,
    CountupTimer,
    ShowHint,
    ConfettiEffect,
  },

  setup() {
    const sudokuLevel = 3;
    const gridSize: GridSize = 9;
    const timePoints = 0;
    const isGameFinished = false;

    const level: Ref<SudokuLevel> = ref('beginner');
    const hint: Ref<InstanceType<typeof ShowHint> | null> = ref(null);
    const timer: Ref<InstanceType<typeof CountupTimer> | null> = ref(null);
    const hintPoints = ref(0);
    const errorPoints = ref(0);
    const puzzleIndex = ref(0);
    const userScore = ref(0);
    const showConfetti = ref(false);
    const grid: Ref<CellState[][]> = ref(
      Array(gridSize)
        .fill(null)
        .map(() =>
          Array(gridSize)
            .fill(null)
            .map(() => new CellState(null, 0))
        )
    );

    const draftGrid: Ref<boolean[][][]> = ref(
      Array(gridSize).fill(Array(gridSize).fill(Array(9).fill(false)))
    );

    const selectedIndexes: Ref<[number, number]> = ref([-1, -1]);

    const draftMode = ref(false);

    const isSelecting = computed(
      () =>
        selectedIndexes.value[0] >= 0 &&
        selectedIndexes.value[0] < gridSize &&
        selectedIndexes.value[1] >= 0 &&
        selectedIndexes.value[1] < gridSize
    );

    const selectedValue = computed(() =>
      isSelecting.value
        ? grid.value[selectedIndexes.value[0]][selectedIndexes.value[1]]
            .cellValue
        : null
    );

    return {
      sudokuLevel,
      draftGrid,
      grid,
      gridSize,
      timePoints,
      level,
      selected: selectedIndexes,
      isSelecting,
      draftMode,
      selectedValue,
      hint,
      timer, 
      hintPoints,
      errorPoints,
      puzzleIndex,
      showConfetti,
      userScore,
      isGameFinished
    };
  },

  mounted() {
    this.registerKeyboardEvents();
    this.newGame();
  },

  methods: {
    registerKeyboardEvents() {
      const ALLOWED_KEYS: { [key: string]: number | null } = {
        Delete: null,
        Digit1: 1,
        Digit2: 2,
        Digit3: 3,
        Digit4: 4,
        Digit5: 5,
        Digit6: 6,
        Digit7: 7,
        Digit8: 8,
        Digit9: 9,
        KeyQ: 10,
        KeyB: 11,
        KeyC: 12,
        KeyD: 13,
        KeyE: 14,
        KeyF: 15,
      };
      
      addEventListener('visibilitychange', () => {
        if (document.hidden && !this.timer?.isPaused) {
          this.timer?.pauseTimer();
        }
      });


      window.addEventListener('keydown', (ev) => {
        if (ev.code in ALLOWED_KEYS) {
          this.assignCell(ALLOWED_KEYS[ev.code]);
          return;
        }

        if (!this.isSelecting) return;

        if (ev.code == 'Space') {
          this.toggleDraftMode();
          return;
        }

        if (ev.code == 'AltLeft') {
          this.quickDraftCell();
          return;
        }

        const i = this.selected[0];
        const j = this.selected[1];

        if (ev.code == 'ArrowRight') {
          this.selected = [i, j >= this.gridSize - 1 ? j : j + 1];
          return;
        }

        if (ev.code == 'ArrowLeft') {
          this.selected = [i, j === 0 ? j : j - 1];
          return;
        }

        if (ev.code == 'ArrowUp') {
          this.selected = [i === 0 ? i : i - 1, j];
          return;
        }

        if (ev.code == 'ArrowDown') {
          this.selected = [i >= this.gridSize - 1 ? i : i + 1, j];
          return;
        }
      });
    },

    generateSudoku(level: SudokuLevel): number[] {
      const puzzleSet = PuzzleSet[level];
      this.puzzleIndex = Math.floor(Math.random() * puzzleSet.length);
      return puzzleSet[this.puzzleIndex];
    },

    generateSudokuAnswers(level: SudokuLevel): number[] {
      const answerSet = PuzzleAnswers[level];
      return answerSet[this.puzzleIndex];
    },

    newGame(): void {
      this.clearAll();

      this.isGameFinished = false;
      this.userScore = 0;
      this.timePoints = 0;
      this.timer?.resetTimer();
      this.hint?.resetHints();

      const puzzle: number[] = this.generateSudoku(this.level);
      const puzzleSolved: number[] = this.generateSudokuAnswers(this.level);

      this.grid = Array(this.gridSize)
        .fill(null)
        .map((_, i) =>
          Array(this.gridSize)
            .fill(null)
            .map(
              (_, j) =>
                new CellState(
                  puzzle[i * this.gridSize + j] || null,
                  puzzleSolved[i * this.gridSize + j]
                )
            )
        );
    },

    toggleDraftMode(): void {
      this.draftMode = !this.draftMode;
    },

    selectCell(i: number, j: number): void {
      this.selected = [i, j];
    },

    clearSelection(): void {
      this.selected = [-1, -1];
    },

    judgeCell(i: number, j: number): boolean {
      let hasError = false;
      const value = this.grid[i][j].cellValue;

      if (value !== null && value !== this.grid[i][j].correctValue) {
        this.setGridWrongValue(i, j);
        hasError = true;
      }
     
      return hasError;
    },

    checkCellValue(i: number, j: number, value: number | null): boolean {
      if (value == null) {
        return false;
      }

      // judge row and col
      for (let k = 0; k < this.gridSize; k++) {
        if (value === this.grid[i][k].cellValue && j != k) {
          return true;
        }

        if (value === this.grid[k][j].cellValue && i != k) {
          return true;
        }
      }
      // judge current square
      const startI = i - (i % this.sudokuLevel);
      const startJ = j - (j % this.sudokuLevel);

      const endI = startI + this.sudokuLevel;
      const endJ = startJ + this.sudokuLevel;

      for (let k = startI; k < endI; k++) {
        for (let m = startJ; m < endJ; m++) {
          if (i == k && j == m) continue; // skip the current cell

          if (value === this.grid[k][m].cellValue) {
            return true;
          }
        }
      }

      return false;
    },

    updatePoints(type: 'hint' | 'error', penalty: number = 0): void {
      const pointDeduction = type === 'hint' ? 5 + penalty : 1;
      this.userScore -= pointDeduction;
  },

    calculateFinalScore(): void {
      this.timePoints = 500 - (this.timer?.totalSeconds || 0);
      console.log('user score', this.userScore);
    },

    triggerConfetti(): void {
      this.showConfetti = true;
      setTimeout(() => {
        this.showConfetti = false;
      }, 4000);
    },

    vibrateCells(duration: number): void {
      const cells = document.querySelectorAll('.cell');

      // Hücrelere "vibrate" sınıfı ekle
      cells.forEach((cell) => {
        cell.classList.add('vibrate');
      });

      // Belirtilen süre sonunda "vibrate" sınıfını kaldır
      setTimeout(() => {
        cells.forEach((cell) => {
          cell.classList.remove('vibrate');
        });
      }, duration);
},


    judgeBoard(): void {
      let hasWon = true;

      this.userScore += 5;

      // checks whole grid to understand if the game is finished
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          const isCellCorrect = this.judgeCell(i, j);
          if (isCellCorrect) {
            this.updatePoints('error');
            this.userScore -= 5;
            return;
          }
          
          if (this.grid[i][j].cellValue === null || isCellCorrect) {
            hasWon = false;
          }
        }
      }

      if (hasWon) {
        this.isGameFinished = true;
        this.calculateFinalScore();
        this.timer?.stopTimer();
        this.vibrateCells(3000);
        this.triggerConfetti();

      }
    },

    setGridValue(i: number, j: number, cellState: CellState): void {
      let modifiedRow = this.grid[i].slice(0);

      modifiedRow[j] = cellState;

      this.grid[i] = modifiedRow;
    },

    toggleDraftGridValue(i: number, j: number, n: number): void {
      const row = this.draftGrid[i].slice(0);
      const arr = row[j].slice(0);
      arr[n - 1] = !arr[n - 1];
      row[j] = arr;
      this.draftGrid[i] = row;
    },

    clearDraftGridCell(i: number, j: number): void {
      const row = this.draftGrid[i].slice(0);

      row[j] = new Array(this.gridSize).fill(false);
      this.draftGrid[i] = row;
    },

    setGridWrongValue(i: number, j: number, wrong = true): void {
      this.setGridValue(i, j, {
        ...this.grid[i][j],
        isWrong: wrong,
      });
    },

    quickDraftCell() {
      this.draftMode = true;
      for (let i = 0; i < this.gridSize; i++) {
        this.assignCell(i + 1);
      }
    },

    // quickDraftAll() {
    //   const savedMode = this.draftMode;
    //   for (let i = 0; i < this.gridSize; i++) {
    //     for (let j = 0; j < this.gridSize; j++) {
    //       this.selected = [i, j]
    //       this.clearDraftGridCell(i, j);
    //       this.quickDraftCell()
    //     }
    //   }
    //   this.clearSelection();

    //   this.draftMode = savedMode;
    // },

    updateDraftGridValues(i: number, j: number, n: number): void {
      for (let k = 0; k < this.gridSize; k++) {
        if (this.draftGrid[i][k][n - 1]) {
          this.toggleDraftGridValue(i, k, n);
        }

        if (this.draftGrid[k][j][n - 1]) {
          this.toggleDraftGridValue(k, j, n);
        }
      }
      // Judge current square
      const startI = i - (i % this.sudokuLevel);
      const startJ = j - (j % this.sudokuLevel);

      const endI = startI + this.sudokuLevel;
      const endJ = startJ + this.sudokuLevel;

      for (let k = startI; k < endI; k++) {
        for (let m = startJ; m < endJ; m++) {
          if (this.draftGrid[k][m][n - 1]) {
            this.toggleDraftGridValue(k, m, n);
          }
        }
      }
    },

    assignCell(n: number | null): void {
      const i = this.selected[0];
      const j = this.selected[1];

      // clear all .cell's .wrong class
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          this.setGridWrongValue(i, j, false);
        }
      }

      if (i < 0 || i >= this.gridSize || (j < 0 && j >= this.gridSize)) return;

      const cell = this.grid[i][j];

      if (cell.isPrefilled) return;
      if (cell.cellValue === n) return; // avoid unnecessary operations
      if (n && n > this.gridSize) return; // For sudokus over 9*9

      if (n && this.draftMode) {
        if (!this.checkCellValue(i, j, n)) {
          this.toggleDraftGridValue(i, j, n);
        }
      } else {
        this.setGridValue(i, j, {
          ...cell,
          cellValue: n,
        });

        this.clearDraftGridCell(i, j);

        if (n != null) {
          this.updateDraftGridValues(i, j, n);
        }
        this.judgeBoard();
      }
    },

    clearAll(): void {
      let board = this.grid;
      let draftGrid = this.draftGrid;

      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          if (!board[i][j].isPrefilled) {
            board[i][j] = new CellState(null, 0);
            draftGrid[i][j] = new Array(this.gridSize).fill(false);
          }
        }
      }

      this.grid = board;
      this.draftGrid = draftGrid;
    },
  },
});
</script>

<template>
  <div class="container m-auto">
    <confetti-effect v-if="showConfetti" />
    <h1
      class="mx-auto py-2 flex w-fit bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-3xl box-content font-extrabold text-transparent text-center select-none"
    >
      Sudoku Game by mertmcd
    </h1>
    <div class="flex flex-col-reverse md:flex-col h-full">
      <!-- Sidebar -->
      <div class="mx-auto mt-4">
        <div class="flex flex-row px-4">
          <button
            class="mx-2 self-center"
            :class="{ 'button-dark': draftMode, button: !draftMode }"
            @click="toggleDraftMode"
          >
            Draft Mode: {{ draftMode ? 'On' : 'Off' }}
          </button>
          <div
            class="mx-2 self-center border border-solid border-gray-400 p-2 rounded"
          >
            <label for="level" class="font-bold">Level: </label>
            <select v-model="level">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded mx-2"
            @click="newGame"
          >
            New Game
          </button>
          <button
            class="bg-gray-400 hover:bg-gray-600 text-white font-bold px-2 rounded mx-2"
            @click="clearAll"
          >
            Clear Board
          </button>

          <countup-timer ref="timer" />

          <show-hint 
            class="hint-button"
            :selected="selected"
            :grid="grid"
            @judge-board="judgeBoard"
            @update-hint-points="updatePoints('hint', $event)"
            ref='hint'
            />

          <!-- <button class="button-dark mx-2" @click="quickDraftAll">Quick Draft All</button> -->
          <!-- <span>(Fill with draft all possible values)</span> -->
        </div>
        <hr class="mt-2" />
        <div class="instructions">
          <h2 class="text-xl font-bold mt-4">Instructions</h2>
          <div class="warning-items flex flex-col items-start mt-2">
            <p>
              <span class="text-red-500 font-bold">**</span>You cannot input
              numbers while draft mode is on.
            </p>
            <p>
              <span class="text-red-500 font-bold">**</span>Each hint will
              progressively decrease your score, starting at -3 and subtracting
              an additional point with each use.
            </p>
            <p>
              <span class="text-red-500 font-bold">**</span>Each incorrect cell
              input will decrease your score by 1 point.
            </p>
            <p>
              <span class="text-red-500 font-bold">**</span>Each correct cell
              input will increase your score by 5 points.
            </p>
            <p>
              <span class="text-red-500 font-bold">**</span>The total elapsed
              time, in seconds, is subtracted from 500 and added to your score,
              so use the pause button if you need to take a break.
            </p>
          </div>
        </div>
      </div>
      <!-- Sudoku Grid -->
      <div class="flex flex-row justify-center">
        <div class="instructions-items mt-12">
          <div class="info-items items-start">
            <p><b>Draft Mode:</b> When enabled, you can add multiple values to
              each cell as notes.
            </p>
            <p>
              Press <b>Space</b> to toggle Draft Mode while a cell is focused.
            </p>
            <p>
              Press <b>Hint</b> to see cell's value while a cell is focused.
            </p>
            <p>
              Press <b class="bg-red-500 p-1 rounded text-white">Undo</b> to
              clear the cell.
            </p>
            <p>
              Press
              <b class="bg-gray-400 p-1 rounded text-white">Clear Board</b> to
              clear all cells.
            </p>
            <p>
              Press
              <b class="bg-green-500 p-1 rounded text-white">New Game</b> to
              start a new game.
            </p>
            <p>
              Press <b class="bg-blue-500 p-1 rounded text-white">Pause</b> to
              pause the timer.
            </p>
            <p>Use the <b>Arrow Keys</b> to navigate the cells.</p>
          </div>
        </div>
        <div class="sudoku-board h-full">
          <div class="container mx-auto mt-4 h-full">
            <div class="flex flex-wrap flex-col h-full">
              <h2 class="text-blue-900 mx-auto w-fit font-semibold text-2xl">Score: {{ userScore }}
                <span v-if="isGameFinished" class="time-bonus"> + Time Bonus ({{ timePoints }}) = 
                  <span class="text-white bg-blue-900 px-2 rounded">{{ userScore + timePoints }}</span>
                </span>
                <span v-if="isGameFinished" class="mx-auto py-2 flex w-fit bg-gradient-to-r from-blue-500 via-teal-500 to-pink-500 bg-clip-text text-3xl box-content font-extrabold text-transparent text-center select-none">Y O U&nbsp;&nbsp;&nbsp;W O N !!!</span>
              </h2>
              <div class="my-4">
                <sudoku-grid :grid="grid" :draft-grid="draftGrid">
                  <template v-slot.default="{ i, j, draft }">
                    <sudoku-cell
                      :cell="grid[i][j]"
                      :draft="draft"
                      :highlighted-value="selectedValue"
                      :is-selected="i == selected[0] && j == selected[1]"
                      @onCellSelect="selectCell(i, j)"
                    />
                  </template>
                </sudoku-grid>
              </div>
              <div class="my-4">
                <!-- Row -->
                <p class="my-2">
                  You can also use the on-screen keyboard instead of the
                  physical keyboard.
                </p>
                <button
                  @click="assignCell(i)"
                  v-for="i in 9"
                  :key="i"
                  class="number-cell flex-grow"
                >
                  {{ i }}
                </button>
                <button
                  @click="assignCell(null)"
                  class="number-cell undo flex-grow"
                >
                  Undo
                </button>
                <p class="mt-2">
                  (<span class="text-red-500 font-bold">**</span>
                  Pressing the undo button only clears the cell. If an error was
                  made, your score will still decrease.)
                </p>
                <!-- <div class="md:invisible w-full grid grid-rows-1 grid-cols-10">
                 </div>-->
                <!-- Col -->
                <!-- <div class="invisible md:visible grid grid-flow-row grid-cols-1 bg-red-300 h-full">
                 </div>-->
              </div>
            </div>
          </div>
        </div>
        <div class="leader-board mt-12">
          <!-- for beginner top 3 name show as list-->
          <h2 class="text-2xl font-bold">Leaderboard</h2>
          <hr />

          <div class="game-levels grid grid-cols-2 gap-x-16 gap-y-8">
            <div class="beginner-board">
              <h3 class="text-lg font-bold">Beginner</h3>
              <ol>
                <li>Player 1</li>
                <li>Player 2</li>
                <li>Player 3</li>
              </ol>
            </div>
            <!-- for intermediate top 3 name show as list-->
            <div class="intermediate-board">
              <h3 class="text-lg font-bold">Intermediate</h3>
              <ol>
                <li>Player 1</li>
                <li>Player 2</li>
                <li>Player 3</li>
              </ol>
            </div>
            <!-- for hard top 3 name show as list-->
            <div class="hard-board">
              <h3 class="text-lg font-bold">Hard</h3>
              <ol>
                <li>Player 1</li>
                <li>Player 2</li>
                <li>Player 3</li>
              </ol>
            </div>
            <!-- for expert top 3 name show as list-->
            <div class="expert-board">
              <h3 class="text-lg font-bold">Expert</h3>
              <ol>
                <li>Player 1</li>
                <li>Player 2</li>
                <li>Player 3</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

.instructions-items {
  @apply flex flex-row gap-y-4;
  max-width: 20rem;
}

.sudoku-board {
  max-width: 40rem;
}

.info-items {
  @apply flex flex-col justify-items-start gap-x-8 gap-y-2;
}

.info-items > p {
  @apply mb-1;
}

li {
  list-style-type: decimal;
}

.number-cell {
  @apply text-3xl hover:bg-gray-200 cursor-pointer border-2 mx-1 border-gray-400 w-12;
  vertical-align: middle;
}

.undo {
  @apply bg-red-500 hover:bg-red-700 text-white w-24 h-10 rounded border-none font-bold text-2xl px-2;
}

.button {
  @apply h-10 px-6 font-semibold rounded-md bg-white text-black;
  @apply border border-slate-700;
}

.button-dark {
  @apply button;
  @apply bg-slate-700 text-white;
}

.sudoku-board.paused {
  filter: blur(7px);
  pointer-events: none;
}

.sudoku-board.you-won {
  filter: blur(7px);
  pointer-events: none;
}

@keyframes vibrate {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 2px); }
  50% { transform: translate(2px, -2px); }
  75% { transform: translate(-2px, -2px); }
  100% { transform: translate(0, 0); }
}

.cell {
  transition: transform 0.2s ease-in-out;
}

.cell.vibrate {
  animation: vibrate 0.3s linear infinite;
}
</style>
