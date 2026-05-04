import { Stack, ArrayStack } from "./stack";
import { performance } from "perf_hooks";

function runStackTests() {
  console.log("=== Stack (Linked List) 기능 테스트 ===");
  const stack = new Stack<number>();

  console.log("1. 초기 상태 isEmpty:", stack.isEmpty());
  
  stack.push(10);
  stack.push(20);
  stack.push(30);
  
  console.log("2. 10, 20, 30 차례대로 push 한 후의 상태:");
  console.log("   - 크기:", stack.size);
  console.log("   - 현재 데이터(배열 표현):", stack.toArray());
  console.log("   - Top 확인 (peek):", stack.peek()); // 30이어야 함

  const popped = stack.pop();
  console.log("3. Pop 실행 결과:", popped);
  console.log("   - Pop 이후의 Top (peek):", stack.peek()); // 20이어야 함
  console.log("   - 현재 크기:", stack.size);

  console.log("\n=== Stack 성능 벤치마크 (Array vs LinkedList) ===");
  const ITERATIONS = 10_000_000;
  
  // 1. Array-based Stack Test
  const arrayStack = new ArrayStack<number>();
  let start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    arrayStack.push(i);
  }
  for (let i = 0; i < ITERATIONS; i++) {
    arrayStack.pop();
  }
  let end = performance.now();
  console.log(`[Array Stack] ${ITERATIONS}회 push & pop 수행 시간: ${(end - start).toFixed(2)}ms`);

  // 2. LinkedList-based Stack Test
  const linkedListStack = new Stack<number>();
  start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    linkedListStack.push(i);
  }
  for (let i = 0; i < ITERATIONS; i++) {
    linkedListStack.pop();
  }
  end = performance.now();
  console.log(`[Linked List Stack] ${ITERATIONS}회 push & pop 수행 시간: ${(end - start).toFixed(2)}ms`);

  console.log("\n[분석 결과]");
  console.log(" - 자바스크립트의 경우 내장 Array의 최적화가 매우 강력하기 때문에,");
  console.log("   연속된 메모리를 사용하는 ArrayStack이 속도 면에서 더 빠를 수 있습니다.");
  console.log(" - 그러나 Linked List 기반 스택은 배열이 가득 찼을 때 발생하는 재할당(Reallocation) 딜레이나 메모리 파편화를 신경 쓰지 않아도 되며,");
  console.log("   '엄격한 O(1)' 성능을 보장한다는 이론적 장점이 있습니다.");
}

runStackTests();
