import { useState } from "react";
import { useStore } from "../store/useStore";

interface SidebarProps {
  onInsert: (value: string) => void;
  onSearch: (value: string) => void;
  onDelete: (value?: string) => void;
  onReset: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ onInsert, onSearch, onDelete, onReset, activeTab, setActiveTab }: SidebarProps) {
  const [inputValue, setInputValue] = useState("");
  const { speed, setSpeed, isPlaying, setIsPlaying, currentStep, events } = useStore();

  const handleAction = (action: (val: string) => void) => {
    if (inputValue.trim()) {
      action(inputValue.trim());
      setInputValue("");
    }
  };

  const tabs = ["Array", "Stack", "Queue", "LinkedList", "BST"];

  const getInsertText = () => {
    if (activeTab === "Stack") return "Push";
    if (activeTab === "Queue") return "Enqueue";
    return "Insert";
  };

  const getDeleteText = () => {
    if (activeTab === "Stack") return "Pop";
    if (activeTab === "Queue") return "Dequeue";
    return "Delete";
  };

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full overflow-y-auto shadow-2xl z-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
          DS Visualizer
        </h1>
        <p className="text-slate-400 text-sm">Interactive Algorithm Sandbox</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Structures</h2>
        <div className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                activeTab === tab
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Operations</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-4 transition-all"
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAction(onInsert)}
            className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
          >
            {getInsertText()}
          </button>
          <button
            onClick={() => handleAction(onSearch)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg px-4 py-2 text-sm font-medium transition-all border border-slate-700"
          >
            Search
          </button>
          <button
            onClick={() => {
              onDelete(inputValue.trim() || undefined);
              setInputValue("");
            }}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg px-4 py-2 text-sm font-medium transition-all"
          >
            {getDeleteText()}
          </button>
        </div>
      </div>

      <div className="mt-auto">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Simulation Control</h2>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Speed: {speed}ms</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
           <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep >= events.length}
            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-sm font-medium transition-all"
          >
            Reset
          </button>
        </div>
        <div className="text-xs text-slate-500 text-center">
          Step: {currentStep} / {events.length}
        </div>
      </div>
    </div>
  );
}
