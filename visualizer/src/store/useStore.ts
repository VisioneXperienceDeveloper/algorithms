import { create } from "zustand";

export interface LogEvent {
  id: string;
  type: string;
  payload: any[];
  timestamp: number;
}

interface VisualizerState {
  events: LogEvent[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  lastExecutionTime: number | null;
  addEvent: (type: string, ...payload: any[]) => void;
  clearEvents: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setLastExecutionTime: (time: number | null) => void;
}

export const useStore = create<VisualizerState>((set) => ({
  events: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500, // ms per step
  lastExecutionTime: null,

  addEvent: (type, ...payload) =>
    set((state) => ({
      events: [
        ...state.events,
        { id: Math.random().toString(36).substring(7), type, payload, timestamp: performance.now() },
      ],
    })),

  clearEvents: () => set({ events: [], currentStep: 0, isPlaying: false, lastExecutionTime: null }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.events.length),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  setStep: (step) => set({ currentStep: step }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setSpeed: (speed) => set({ speed }),
  setLastExecutionTime: (time) => set({ lastExecutionTime: time }),
}));
