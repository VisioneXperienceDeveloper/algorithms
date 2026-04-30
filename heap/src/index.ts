import { Heap } from "./heap";

const runBenchmark = () => {
  console.log("=== Heap (Priority Queue) Benchmark ===");

  const N = 10000; // Array 비교용 1만 개
  const testData = Array.from({ length: N }, () => Math.floor(Math.random() * N));

  console.log(`\n[1] Naive Array vs Heap: N = ${N.toLocaleString()} 삽입 및 전체 추출 테스트`);

  // --- Array Sort (Naive Priority Queue) ---
  const startNaive = performance.now();
  let naiveArr: number[] = [];
  // 1. 삽입
  for (let i = 0; i < N; i++) {
    naiveArr.push(testData[i]);
  }
  // 2. 추출 (매번 최솟값을 찾기 위해 내림차순 정렬 후 pop)
  const naiveResult: number[] = [];
  for (let i = 0; i < N; i++) {
    naiveArr.sort((a, b) => b - a); // 최솟값이 맨 끝에 오도록 정렬
    naiveResult.push(naiveArr.pop()!);
  }
  const endNaive = performance.now();

  // --- Heap (Priority Queue) ---
  const startHeap = performance.now();
  const heap = new Heap<number>();
  // 1. 삽입 (O(log N))
  for (let i = 0; i < N; i++) {
    heap.push(testData[i]);
  }
  // 2. 추출 (O(log N))
  const heapResult: number[] = [];
  for (let i = 0; i < N; i++) {
    heapResult.push(heap.pop()!);
  }
  const endHeap = performance.now();

  console.log(`- Array + Sort 방식: ${(endNaive - startNaive).toFixed(2)}ms`);
  console.log(`- Heap (push/pop) 방식: ${(endHeap - startHeap).toFixed(2)}ms`);
  console.log(`- Speedup: ${((endNaive - startNaive) / (endHeap - startHeap)).toFixed(2)}x faster`);

  // 정렬 정확성 검증
  let isSorted = true;
  for (let i = 1; i < N; i++) {
    if (heapResult[i - 1] > heapResult[i]) {
      isSorted = false;
      console.log(`- FAIL AT index ${i}: prev=${heapResult[i - 1]}, curr=${heapResult[i]}`);
      break;
    }
  }
  console.log(`- 정렬 결과 정확도 검증: ${isSorted ? "성공 (PASS)" : "실패 (FAIL)"}`);

  // --- O(N) Heapify 최적화 테스트 ---
  console.log(`\n[2] O(N) Heapify 최적화 비교 (N = ${N.toLocaleString()})`);
  
  const startPushN = performance.now();
  const heapN = new Heap<number>();
  for (let i = 0; i < N; i++) {
    heapN.push(testData[i]); // 전체 O(N log N)
  }
  const endPushN = performance.now();

  const startHeapify = performance.now();
  const heapified = Heap.heapify(testData); // 전체 O(N)
  const endHeapify = performance.now();

  console.log(`- 개별 push N번 호출 O(N log N): ${(endPushN - startPushN).toFixed(2)}ms`);
  console.log(`- 한 번에 heapify 수행 O(N): ${(endHeapify - startHeapify).toFixed(2)}ms`);

  // --- 객체 우선순위 테스트 ---
  console.log(`\n[3] 객체 커스텀 Comparator (Max-Heap) 응용 테스트`);
  type Task = { name: string; priority: number };
  
  // 우선순위가 높을수록 먼저 나오는 Max-Heap
  const taskQueue = new Heap<Task>((a, b) => b.priority - a.priority);
  
  taskQueue.push({ name: "Fix Typo", priority: 1 });
  taskQueue.push({ name: "Fix Critical Login Bug", priority: 10 });
  taskQueue.push({ name: "Update CSS", priority: 3 });

  console.log(`- Task 1: ${taskQueue.pop()?.name} (예상: Fix Critical Login Bug)`);
  console.log(`- Task 2: ${taskQueue.pop()?.name} (예상: Update CSS)`);
  console.log(`- Task 3: ${taskQueue.pop()?.name} (예상: Fix Typo)`);

  console.log("\n=== Heap Test Finished ===");
};

runBenchmark();
