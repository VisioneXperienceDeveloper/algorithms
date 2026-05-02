import { LinkedList } from "./linkedList";
// 성능 비교를 위해 이전 모듈의 DynamicArray를 직접 복사하거나 Node 내장 배열을 사용.
// 모듈 의존성 대신 순수 JavaScript 배열(동적 배열 구조)과 비교합니다.

const runLinkedListTest = () => {
  console.log("=== Linked List Test ===");

  const list = new LinkedList<number>();

  // 1. 기본 조작 테스트
  console.log("\n[1] Basic Operations");
  list.append(10);
  list.append(20);
  list.append(30);
  console.log(` After append 10, 20, 30: [${list.toArray().join(" -> ")}]`);

  list.prepend(5);
  console.log(` After prepend 5: [${list.toArray().join(" -> ")}]`);

  list.insertAt(2, 15);
  console.log(` After insertAt(2, 15): [${list.toArray().join(" -> ")}]`);
  // 예상: 5 -> 10 -> 15 -> 20 -> 30

  list.removeAt(3);
  console.log(` After removeAt(3) (Value 20): [${list.toArray().join(" -> ")}]`);
  // 예상: 5 -> 10 -> 15 -> 30

  // 2. Array vs Linked List 성능 비교 (맨 앞 삽입)
  console.log("\n[2] Performance Benchmark: Prepend (Insert at 0)");
  console.log(" - 시나리오: 맨 앞에 요소 50,000번 반복 삽입");

  const N = 50000;

  // 2.1 JavaScript 기본 배열 (내부적으로 동적 배열 및 Shift 연산 발생)
  const arrayTest = [];
  const startArr = performance.now();
  for (let i = 0; i < N; i++) {
    arrayTest.unshift(i); // unshift는 O(N) 비용 발생
  }
  const endArr = performance.now();
  console.log(` - Array.unshift(): ${(endArr - startArr).toFixed(2)}ms`);

  // 2.2 Linked List (포인터 갱신 O(1))
  const linkedListTest = new LinkedList<number>();
  const startList = performance.now();
  for (let i = 0; i < N; i++) {
    linkedListTest.prepend(i); // prepend는 O(1) 비용 발생
  }
  const endList = performance.now();
  console.log(` - LinkedList.prepend(): ${(endList - startList).toFixed(2)}ms`);

  console.log("\n=== Linked List Test Finished ===");
};

runLinkedListTest();
