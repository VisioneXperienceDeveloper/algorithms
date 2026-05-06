import { Deque, ArrayDeque } from "./deque";
import { performance } from "perf_hooks";

function runDequeTests() {
  console.log("=== Deque (Doubly Linked List) 기능 테스트 ===");
  const deque = new Deque<number>();

  deque.addRear(10);
  deque.addRear(20);
  deque.addFront(5);
  // 상태: [5, 10, 20]
  
  console.log("1. 초기 상태 (addRear(10), addRear(20), addFront(5)):");
  console.log("   - 데이터:", deque.toArray());
  console.log("   - Front:", deque.peekFront(), "/ Rear:", deque.peekRear());

  console.log("2. removeRear() 호출:", deque.removeRear()); // 20
  console.log("3. removeFront() 호출:", deque.removeFront()); // 5
  console.log("4. 최종 상태:");
  console.log("   - 데이터:", deque.toArray()); // [10]
  console.log("   - 크기:", deque.size);

  console.log("\n=== Deque 성능 벤치마크 (Array vs Doubly Linked List) ===");
  const OPERATIONS = 50_000;
  
  // 1. Array-based Deque Test
  const arrayDeque = new ArrayDeque<number>();
  let start = performance.now();
  for (let i = 0; i < OPERATIONS; i++) {
    arrayDeque.addFront(i); // O(N)
    arrayDeque.addRear(i);  // O(1)
  }
  for (let i = 0; i < OPERATIONS; i++) {
    arrayDeque.removeFront(); // O(N)
    arrayDeque.removeRear();  // O(1)
  }
  let end = performance.now();
  console.log(`[Array Deque] ${OPERATIONS}회 양방향 삽입/삭제 수행 시간: ${(end - start).toFixed(2)}ms`);

  // 2. Doubly LinkedList-based Deque Test
  const linkedDeque = new Deque<number>();
  start = performance.now();
  for (let i = 0; i < OPERATIONS; i++) {
    linkedDeque.addFront(i); // O(1)
    linkedDeque.addRear(i);  // O(1)
  }
  for (let i = 0; i < OPERATIONS; i++) {
    linkedDeque.removeFront(); // O(1)
    linkedDeque.removeRear();  // O(1)
  }
  end = performance.now();
  console.log(`[Doubly Linked List Deque] ${OPERATIONS}회 양방향 삽입/삭제 수행 시간: ${(end - start).toFixed(2)}ms`);

  console.log("\n[분석 결과]");
  console.log(" - 양쪽 끝을 모두 조작해야 하는 Deque 특성상, Array를 사용하면 필연적으로 O(N) 연산(unshift, shift)이 절반을 차지합니다.");
  console.log(" - Doubly Linked List 기반 Deque는 이전 노드(prev) 포인터를 추가하여 Rear 삭제까지 완벽한 O(1)로 만들어 성능 저하를 방지합니다.");
}

runDequeTests();
