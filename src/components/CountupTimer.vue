<script lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  
  export default {
    name: 'CountupTimer',
    setup() {
      const minutes = ref(0);
      const seconds = ref(0);
      const isPaused = ref(false);
      const timer = ref<number | null>(null);
  
      const formatTime = (unit: number) => (unit < 10 ? `0${unit}` : unit.toString());
  
      const time = computed(() => {
        return `${formatTime(minutes.value)}:${formatTime(seconds.value)}`;
      });
  
      const startTimer = () => {
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
  
      const pauseTimer = () => {
        isPaused.value = !isPaused.value;
      };
  
      const resetTimer = () => {
        minutes.value = 0;
        seconds.value = 0;
        isPaused.value = false;
        if (timer.value !== null) {
          clearInterval(timer.value);
        }
        startTimer();
      };
  
      onMounted(() => {
        startTimer();
      });
  
      onBeforeUnmount(() => {
        if (timer.value !== null) {
          clearInterval(timer.value);
        }
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