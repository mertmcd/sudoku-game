  <script lang="ts">
    import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
    import confetti from 'canvas-confetti';
    
  export default defineComponent({
    name: 'ConfettiEffect',
  
    props: {
      duration: {
        type: Number,
        default: 4000, // 4 saniye
      },
    },
  
    setup(props) {
      const confettiCanvas = ref<HTMLCanvasElement | null>(null);
      let confettiInstance: any = null;
  
      const startConfetti = () => {
        if (!confettiCanvas.value) return;
  
        confettiInstance = confetti;
  
        confettiInstance({
          particleCount: 500,
          spread: 100,
          origin: { y: 0.6 },
        });
  
        setTimeout(() => {
          stopConfetti();
        }, props.duration);
      };
  
      const stopConfetti = () => {
        if (confettiInstance) {
          confettiInstance.reset();
          confettiInstance = null;
        }
      };
  
      onMounted(() => {
        startConfetti();
      });
  
      onBeforeUnmount(() => {
        stopConfetti();
      });
  
      return {
        confettiCanvas,
      };
    },
  });
  </script>

<template>
    <div>
      <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
    </div>
  </template>
  
  <style scoped>
  .confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
  }
  </style>
  