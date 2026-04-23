import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";

export function useSimulator() {
  const { isPlaying, speed, currentStep, events, nextStep } = useStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStep < events.length) {
      timerRef.current = setTimeout(() => {
        nextStep();
      }, speed);
    } else if (isPlaying && currentStep >= events.length) {
      // Auto pause at the end
      useStore.getState().setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, speed, events.length, nextStep]);

  return null;
}
