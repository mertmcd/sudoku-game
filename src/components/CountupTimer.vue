<template>
    <div class="countup-timer text-3xl text-center flex border-l-2 pl-4 items-center">
      <p>{{ time }}</p>
      <button class="bg-blue-500 hover:bg-blue-700 w-20 p-2 text-base text-white text-center border-none rounded ml-4 cursor-pointer" @click="pauseTimer">{{ isPaused ? 'Resume' : 'Pause' }}</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        minutes: 0,
        seconds: 0,
        timer: null,
        isPaused: false,
      };
    },
    computed: {
      time() {
        return `${this.formatTime(this.minutes)}:${this.formatTime(this.seconds)}`;
      },
    },
    methods: {
      formatTime(unit) {
        return unit < 10 ? `0${unit}` : unit;
      },
      startTimer() {
        if (this.timer) {
          clearInterval(this.timer);
        }
  
        this.timer = setInterval(() => {
          if (!this.isPaused) {
            if (this.seconds === 59) {
              this.minutes++;
              this.seconds = 0;
            } else {
              this.seconds++;
            }
          }
        }, 1000);
      },
      pauseTimer() {
        this.isPaused = !this.isPaused;
      },
      resetTimer() {
        this.minutes = 0;
        this.seconds = 0;
        this.isPaused = false;
        this.startTimer();
      }
    },
    mounted() {
      //this.startTimer();
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
  };
  </script>
  