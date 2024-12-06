<script lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, Ref } from 'vue';

export default {
  name: 'CountupTimer',
  setup( props, { expose }) {
    const minutes: Ref<number> = ref(0);
    const seconds: Ref<number> = ref(0);
    const isPaused: Ref<boolean> = ref(false);
    const timer: Ref<number | null> = ref(null);

    const formatTime = (unit: number): string => (unit < 10 ? `0${unit}` : unit.toString());

    const time = computed((): string => {
      return `${formatTime(minutes.value)}:${formatTime(seconds.value)}`;
    });

    const startTimer = (): void => {
      if (timer.value !== null) {
        clearInterval(timer.value);
      }

      timer.value = window.setInterval(() => {
        if (!isPaused.value) {
          if (seconds.value === 59) {
            minutes.value++;
            seconds.value = 0;
          } else {
            seconds.value++;
          }
        }
      }, 1000);
    };

    const pauseTimer = (): void => {
      isPaused.value = !isPaused.value;

      const sudokuBoard = document.querySelector('.sudoku-board') as HTMLElement | null;
      if (sudokuBoard) {
        if (isPaused.value) {
          sudokuBoard.classList.add('paused');
        } else {
          sudokuBoard.classList.remove('paused');
        }
      }
    };

    const resetTimer = (): void => {
      minutes.value = 0;
      seconds.value = 0;
      isPaused.value = false;
      if (timer.value !== null) {
        clearInterval(timer.value);
      }
      startTimer();
    };

    onMounted((): void => {
      startTimer();
    });

    onBeforeUnmount((): void => {
      if (timer.value !== null) {
        clearInterval(timer.value);
      }
    });

    expose({
      resetTimer,
      pauseTimer,
    });

    return {
      minutes,
      seconds,
      isPaused,
      time,
      startTimer,
      pauseTimer,
      resetTimer,
    };
  },
};
</script>

<template>
  <div class="countup-timer text-3xl text-center flex border-l-2 pl-4 items-center">
    <p>{{ time }}</p>
    <button
      class="bg-blue-500 hover:bg-blue-700 w-20 p-2 text-base font-semibold text-white text-center border-none rounded ml-4 cursor-pointer"
      @click="pauseTimer"
    >
      {{ isPaused ? 'Resume' : 'Pause' }}
    </button>
  </div>
</template>
