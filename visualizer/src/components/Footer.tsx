import { useStore } from "../store/useStore";

export function Footer() {
  const { events, currentStep, lastExecutionTime, isPlaying } = useStore();

  const currentEvent = currentStep > 0 && currentStep <= events.length ? events[currentStep - 1] : null;

  return (
    <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center px-6 justify-between shadow-lg z-10 relative">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Status:</span>
          <span className={`text-sm font-medium ${currentEvent?.type === 'not_found' ? 'text-rose-400' : 'text-indigo-400'}`}>
            {currentEvent ? (
              currentEvent.type === "not_found" ? `Search completed: '${currentEvent.payload[0]}' not found.` :
              currentEvent.type === "found" ? `Search completed: '${currentEvent.payload[0]}' found!` :
              isPlaying ? `Executing ${currentEvent.type.charAt(0).toUpperCase() + currentEvent.type.slice(1)} operation...` : `${currentEvent.type.charAt(0).toUpperCase() + currentEvent.type.slice(1)} operation completed.`
            ) : "Idle"}
          </span>
        </div>
      </div>
      
      {currentEvent && currentEvent.timestamp && lastExecutionTime !== null && (
        <div className="flex items-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Execution Time:</span>
          <span className="text-sm font-mono text-emerald-400">
            {lastExecutionTime.toFixed(1)} ms
          </span>
        </div>
      )}
    </div>
  );
}
