import { motion } from "framer-motion";
import { useStore } from "../../store/useStore";

interface LinearVisualizerProps {
  data: string[];
  type: "Array" | "Stack" | "Queue";
}

export function LinearVisualizer({ data, type }: LinearVisualizerProps) {
  const { events, currentStep } = useStore();
  let activeIndices: number[] = [];
  let swapIndices: number[] = [];
  let foundIndices: number[] = [];

  if (currentStep > 0 && currentStep <= events.length) {
    const event = events[currentStep - 1];
    if (event.type === "access" || event.type === "compare") {
      const idx = event.payload[1];
      if (typeof idx === "number") activeIndices = [idx];
    } else if (event.type === "swap") {
      swapIndices = [event.payload[2], event.payload[3]];
    } else if (event.type === "insert" || event.type === "update" || event.type === "delete") {
      const idx = event.payload[1];
      if (typeof idx === "number") activeIndices = [idx];
    } else if (event.type === "found") {
      const idx = event.payload[1];
      if (typeof idx === "number") foundIndices = [idx];
    }
  }

  const isStack = type === "Stack";
  const isQueue = type === "Queue";

  // Use occurrence-based keys to maintain stable identities even with duplicates
  const itemCounts: Record<string, number> = {};

  return (
    <div className={`flex items-center justify-center w-full h-full p-8 ${isStack ? 'flex-col justify-end pb-24' : 'flex-col'}`}>
      <div className={`flex gap-4 items-center justify-center ${isStack ? 'flex-col-reverse' : 'flex-wrap'}`}>
        {data.map((item, index) => {
          const currentCount = itemCounts[item] || 0;
          itemCounts[item] = currentCount + 1;
          const stableKey = `${item}-${currentCount}`;

          const isActive = activeIndices.includes(index);
          const isSwap = swapIndices.includes(index);
          const isFound = foundIndices.includes(index);
          
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.5, y: isStack ? -50 : -20 }}
              animate={{ opacity: 1, scale: isFound ? 1.15 : 1, y: isFound ? -10 : 0 }}
              exit={{ opacity: 0, scale: 0.5, y: isStack ? -50 : 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              key={stableKey}
              className="flex flex-col items-center transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg border-2 transition-colors duration-300 ${
                  isFound
                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 scale-110 shadow-indigo-500/20"
                    : isSwap
                    ? "bg-rose-500/20 border-rose-500 text-rose-300"
                    : isActive
                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 scale-105"
                    : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                {item}
              </div>
              <span className="text-xs text-slate-500 mt-2 font-mono">
                {isStack ? `Top - ${data.length - 1 - index}` : isQueue ? (index === 0 ? "Front (0)" : index === data.length - 1 ? `Rear (${index})` : index) : index}
              </span>
            </motion.div>
          );
        })}
      </div>
      {data.length === 0 && (
        <div className="text-slate-500 text-lg">{type} is empty. Insert some values!</div>
      )}
    </div>
  );
}
