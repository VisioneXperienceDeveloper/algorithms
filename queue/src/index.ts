import { Queue, ArrayQueue } from "./queue";
import { performance } from "perf_hooks";

function runQueueTests() {
  console.log("=== Queue (Linked List) 기능 테스트 ===");
  const queue = new Queue<number>();

  console.log("1. 초기 상태 isEmpty:", queue.isEmpty());
  
  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);
  
  console.log("2. 10, 20, 30 차례대로 enqueue 한 후의 상태:");
  console.log("   - 크기:", queue.size);
  console.log("   - 현재 데이터(배열 표현):", queue.toArray());
  console.log("   - Front 확인 (peek):", queue.peek()); // 10이어야 함

  const dequeued = queue.dequeue();
  console.log("3. Dequeue 실행 결과:", dequeued);
  console.log("   - Dequeue 이후의 Front (peek):", queue.peek()); // 20이어야 함
  console.log("   - 현재 크기:", queue.size);

  console.log("\n=== Queue 성능 벤치마크 (Array vs LinkedList) ===");
  const ENQUEUE_COUNT = 100_000;
  
  // 1. Array-based Queue Test
  const arrayQueue = new ArrayQueue<number>();
  let start = performance.now();
  for (let i = 0; i < ENQUEUE_COUNT; i++) {
    arrayQueue.enqueue(i); // O(1)
  }
  for (let i = 0; i < ENQUEUE_COUNT; i++) {
    arrayQueue.dequeue(); // O(N) 때문에 엄청난 지연 발생
  }
  let end = performance.now();
  console.log(`[Array Queue] ${ENQUEUE_COUNT}회 enqueue & dequeue 수행 시간: ${(end - start).toFixed(2)}ms`);

  // 2. LinkedList-based Queue Test
  const linkedListQueue = new Queue<number>();
  start = performance.now();
  for (let i = 0; i < ENQUEUE_COUNT; i++) {
    linkedListQueue.enqueue(i); // O(1)
  }
  for (let i = 0; i < ENQUEUE_COUNT; i++) {
    linkedListQueue.dequeue(); // O(1)
  }
  end = performance.now();
  console.log(`[Linked List Queue] ${ENQUEUE_COUNT}회 enqueue & dequeue 수행 시간: ${(end - start).toFixed(2)}ms`);

  console.log("\n[분석 결과]");
  console.log(" - 자바스크립트 Array의 shift() 연산은 제거 후 남은 요소들의 인덱스를 모두 당겨야 하므로 O(N)입니다.");
  console.log("   따라서 N이 커질수록 큐의 속도는 기하급수적으로(O(N^2)) 느려집니다.");
  console.log(" - 반면, Linked List를 기반으로 한 큐는 head와 tail 포인터만 변경하므로");
  console.log("   데이터의 크기와 무관하게 항상 O(1)의 일관된 성능을 보입니다.");
  console.log(" - 결론: JS에서 Queue가 필요하다면 절대로 내장 배열(Array)을 그냥 쓰지 말고 연결 리스트(Linked List)로 구현해야 합니다!");
}

runQueueTests();
