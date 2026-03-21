import { ref, watch, type WatchSource } from "vue";

export function useCountUp(source: WatchSource<number>, duration = 1200) {
  const animated = ref(0);

  watch(source, (target) => {
    if (!target || target <= 0) {
      animated.value = 0;
      return;
    }

    const startValue = animated.value;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      animated.value = Math.round(startValue + (target - startValue) * ease);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, { immediate: true });

  return animated;
}