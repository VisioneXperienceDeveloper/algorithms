import { DynamicArray } from "./array";

const runArrayTest = () => {
  console.log("=== Dynamic Array (Custom) Test ===");

  const arr = new DynamicArray<number>(2); // 초기 용량 2
  console.log(`[초기] length: ${arr.length}, capacity: ${arr.capacity}`);

  // 1. push를 통한 자동 Resize 시연
  console.log("\n[1] Pushing 5 elements...");
  for (let i = 1; i <= 5; i++) {
    arr.push(i * 10);
    console.log(` Pushed ${i * 10} => length: ${arr.length}, capacity: ${arr.capacity}`);
  }
  // 예상 capacity: 2 -> 4 -> 8

  // 2. Index 접근 및 변경
  console.log("\n[2] Get and Set");
  console.log(` get(2) => ${arr.get(2)}`); // 30
  arr.set(2, 999);
  console.log(` set(2, 999) => get(2) is now ${arr.get(2)}`); // 999

  // 3. insertAt (O(N) Shift)
  console.log("\n[3] Insert At Index 1 (Shift right)");
  arr.insertAt(1, 15);
  let elements = [];
  for (let i = 0; i < arr.length; i++) elements.push(arr.get(i));
  console.log(` After insertAt(1, 15): [${elements.join(", ")}]`);
  // [10, 15, 20, 999, 40, 50]

  // 4. removeAt (O(N) Shift)
  console.log("\n[4] Remove At Index 3 (Shift left)");
  const removed = arr.removeAt(3);
  elements = [];
  for (let i = 0; i < arr.length; i++) elements.push(arr.get(i));
  console.log(` Removed ${removed} => [${elements.join(", ")}]`);
  // [10, 15, 20, 40, 50]

  // 5. 성능 비교: push (O(1)) vs insertAt (O(N))
  console.log("\n[5] Performance Benchmark: O(1) Push vs O(N) InsertAt(0)");
  const N = 30000;
  
  const pushArr = new DynamicArray<number>();
  const startPush = performance.now();
  for (let i = 0; i < N; i++) {
    pushArr.push(i);
  }
  const endPush = performance.now();
  console.log(` - Push ${N} times: ${(endPush - startPush).toFixed(2)}ms`);

  const insertArr = new DynamicArray<number>();
  const startInsert = performance.now();
  for (let i = 0; i < N; i++) {
    insertArr.insertAt(0, i); // 매번 전체 데이터를 shift 함
  }
  const endInsert = performance.now();
  console.log(` - InsertAt(0) ${N} times: ${(endInsert - startInsert).toFixed(2)}ms`);
  
  console.log("\n=== Array Test Finished ===");
};

runArrayTest();
