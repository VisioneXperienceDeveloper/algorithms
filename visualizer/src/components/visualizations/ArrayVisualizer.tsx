import { motion } from "framer-motion";
import { useStore } from "../../store/useStore";
import { useEffect, useState } from "react";

interface ArrayVisualizerProps {
  data: string[];
}

export function ArrayVisualizer({ data }: ArrayVisualizerProps) {
  const { events, currentStep } = useStore();
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swapIndices, setSwapIndices] = useState<number[]>([]);

  useEffect(() => {
    // Reset highlights
    setActiveIndices([]);
    setSwapIndices([]);

    if (currentStep > 0 && currentStep <= events.length) {
      const event = events[currentStep - 1];
      if (event.type === "access" || event.type === "compare") {
        const idx = event.payload[1];
        if (typeof idx === "number") setActiveIndices([idx]);
      } else if (event.type === "swap") {
        setSwapIndices([event.payload[2], event.payload[3]]);
      } else if (event.type === "insert" || event.type === "update") {
        const idx = event.payload[1];
        if (typeof idx === "number") setActiveIndices([idx]);
      }
    }
  }, [currentStep, events]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {data.map((item, index) => {
          const isActive = activeIndices.includes(index);
          const isSwap = swapIndices.includes(index);
          
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              key={`${index}-${item}`} // simple key for now
              className={`flex flex-col items-center`}
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg border-2 transition-colors duration-300 ${
                  isSwap
                    ? "bg-rose-500/20 border-rose-500 text-rose-300"
                    : isActive
                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                    : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                {item}
              </div>
              <span className="text-xs text-slate-500 mt-2 font-mono">{index}</span>
            </motion.div>
          );
        })}
      </div>
      {data.length === 0 && (
        <div className="text-slate-500 text-lg">Array is empty. Insert some values!</div>
      )}
    </div>
  );
}
