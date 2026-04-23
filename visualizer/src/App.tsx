import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { LinearVisualizer } from "./components/visualizations/LinearVisualizer";
import { useSimulator } from "./hooks/useSimulator";
import { ObservableArray } from "../../linear-structures/src/observable-array";
import { ObservableStack } from "../../linear-structures/src/observable-stack";
import { ObservableQueue } from "../../linear-structures/src/observable-queue";
import { useStore } from "./store/useStore";

function App() {
  const [activeTab, setActiveTab] = useState("Array");
  const { clearEvents, currentStep, events } = useStore();
  
  useSimulator(); // Initialize simulator hook

  // Initialize instances using useState so they persist across renders
  const [observableArray] = useState(() => {
    const arr = new ObservableArray<string>();
    arr.observer = { onEvent: (event, ...args) => useStore.getState().addEvent(event, ...args) };
    return arr;
  });

  const [observableStack] = useState(() => {
    const stack = new ObservableStack<string>();
    stack.observer = { onEvent: (event, ...args) => useStore.getState().addEvent(event, ...args) };
    return stack;
  });

  const [observableQueue] = useState(() => {
    const queue = new ObservableQueue<string>();
    queue.observer = { onEvent: (event, ...args) => useStore.getState().addEvent(event, ...args) };
    return queue;
  });

  // Derived state to reflect the data structure at currentStep
  const [displayData, setDisplayData] = useState<string[]>([]);

  useEffect(() => {
    // Basic logic to replay events up to currentStep and reconstruct state
    if (["Array", "Stack", "Queue"].includes(activeTab)) {
      let tempArr: string[] = [];
      for (let i = 0; i < currentStep; i++) {
        const ev = events[i];
        if (ev.type === "insert") {
          tempArr.push(ev.payload[0]);
        } else if (ev.type === "delete") {
          const idx = ev.payload[1];
          if (typeof idx === "number" && idx >= 0 && idx < tempArr.length) {
            tempArr.splice(idx, 1);
          } else {
            if (activeTab === "Queue") tempArr.shift();
            else tempArr.pop();
          }
        } else if (ev.type === "update") {
          tempArr[ev.payload[1]] = ev.payload[0];
        } else if (ev.type === "swap") {
          const idx1 = ev.payload[2];
          const idx2 = ev.payload[3];
          const temp = tempArr[idx1];
          tempArr[idx1] = tempArr[idx2];
          tempArr[idx2] = temp;
        }
      }
      setDisplayData(tempArr);

      // Sync the active structure so future actions apply correctly
      if (activeTab === "Array") {
        const tempObserver = observableArray.observer;
        observableArray.observer = undefined; // disable emitting
        while (observableArray.length > 0) observableArray.pop();
        tempArr.forEach(item => observableArray.push(item));
        observableArray.observer = tempObserver;
      } else if (activeTab === "Stack") {
        const tempObserver = observableStack.observer;
        observableStack.observer = undefined;
        while (observableStack.length > 0) observableStack.pop();
        tempArr.forEach(item => observableStack.push(item));
        observableStack.observer = tempObserver;
      } else if (activeTab === "Queue") {
        const tempObserver = observableQueue.observer;
        observableQueue.observer = undefined;
        while (observableQueue.length > 0) observableQueue.dequeue();
        tempArr.forEach(item => observableQueue.enqueue(item));
        observableQueue.observer = tempObserver;
      }
    }
  }, [currentStep, events, activeTab, observableArray, observableStack, observableQueue]);

  const handleInsert = (value: string) => {
    const start = performance.now();
    if (activeTab === "Array") observableArray.push(value);
    else if (activeTab === "Stack") observableStack.push(value);
    else if (activeTab === "Queue") observableQueue.enqueue(value);
    const end = performance.now();
    
    useStore.getState().setLastExecutionTime(end - start);
    useStore.getState().setIsPlaying(true);
  };

  const handleSearch = (value: string) => {
    const start = performance.now();
    let found = false;
    let foundIndex = -1;

    if (activeTab === "Array") {
      const arr = observableArray.toArray();
      for (let i = 0; i < arr.length; i++) {
        observableArray.get(i); // This emits "access" automatically
        if (arr[i] === value) {
          found = true;
          foundIndex = i;
          break;
        }
      }
    } else if (activeTab === "Stack") {
      const arr = observableStack.toArray();
      // Search from top to bottom
      for (let i = arr.length - 1; i >= 0; i--) {
        useStore.getState().addEvent("access", arr[i], i);
        if (arr[i] === value) {
          found = true;
          foundIndex = i;
          break;
        }
      }
    } else if (activeTab === "Queue") {
      const arr = observableQueue.toArray();
      // Search from front to back
      for (let i = 0; i < arr.length; i++) {
        useStore.getState().addEvent("access", arr[i], i);
        if (arr[i] === value) {
          found = true;
          foundIndex = i;
          break;
        }
      }
    }

    if (found) useStore.getState().addEvent("found", value, foundIndex);
    else useStore.getState().addEvent("not_found", value);

    const end = performance.now();
    useStore.getState().setLastExecutionTime(end - start);
    useStore.getState().setIsPlaying(true);
  };

  const handleDelete = (value?: string) => {
    const start = performance.now();
    if (activeTab === "Array") {
      if (value) {
        const arr = observableArray.toArray();
        const idx = arr.indexOf(value);
        if (idx !== -1) {
          observableArray.removeAt(idx);
        } else {
          useStore.getState().addEvent("not_found", value);
        }
      } else {
        observableArray.pop();
      }
    }
    else if (activeTab === "Stack") observableStack.pop();
    else if (activeTab === "Queue") observableQueue.dequeue();
    const end = performance.now();

    useStore.getState().setLastExecutionTime(end - start);
    useStore.getState().setIsPlaying(true);
  };

  const handleReset = () => {
    clearEvents();
    setDisplayData([]);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-200">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onInsert={handleInsert}
        onSearch={handleSearch}
        onDelete={handleDelete}
        onReset={handleReset}
      />
      
      <div className="flex-1 flex flex-col relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <div className="flex-1 relative z-10">
          {["Array", "Stack", "Queue"].includes(activeTab) && (
            <LinearVisualizer data={displayData} type={activeTab as any} />
          )}
          {!["Array", "Stack", "Queue"].includes(activeTab) && (
            <div className="flex items-center justify-center w-full h-full text-slate-500">
              {activeTab} visualization coming soon...
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;
