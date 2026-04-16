import { FenwickTree } from "./fenwick-tree";

const testFenwickTree = () => {
  console.log("=== Fenwick Tree (Binary Indexed Tree) Test ===");

  const arr = [1, 3, 5, 7, 9, 11];
  console.log(`Initial Array: [${arr.join(", ")}]`);

  const ft = FenwickTree.fromArray(arr);
  ft.dump();

  // Test 1: Prefix sum queries
  console.log("\n[Test 1] Prefix Sum Queries:");
  console.log("query(2) (Sum 0-2):", ft.query(2)); // 1 + 3 + 5 = 9
  console.log("query(5) (Sum 0-5):", ft.query(5)); // 36

  // Test 2: Range sum queries
  console.log("\n[Test 2] Range Sum Queries:");
  console.log("queryRange(1, 3):", ft.queryRange(1, 3)); // 3 + 5 + 7 = 15
  console.log("queryRange(2, 4):", ft.queryRange(2, 4)); // 5 + 7 + 9 = 21

  // Test 3: Point Update (Add)
  console.log("\n[Test 3] Point Update (Add):");
  console.log("Add 10 to index 2 (was 5, becomes 15)");
  ft.add(2, 10);
  console.log("New query(2):", ft.query(2)); // 1 + 3 + 15 = 19
  console.log("New queryRange(1, 4):", ft.queryRange(1, 4)); // 3 + 15 + 7 + 9 = 34

  // Test 4: Stress Test with Random Data
  console.log("\n[Test 4] Stress Test with Random Data:");
  const size = 1000;
  const largeArr = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  const ftLarge = FenwickTree.fromArray(largeArr);

  let success = true;
  for (let i = 0; i < 50; i++) {
    const l = Math.floor(Math.random() * (size / 2));
    const r = l + Math.floor(Math.random() * (size / 2));
    
    const bitResult = ftLarge.queryRange(l, r);
    const naiveResult = largeArr.slice(l, r + 1).reduce((a, b) => a + b, 0);

    if (bitResult !== naiveResult) {
      console.error(`- Mismatch at [${l}, ${r}]: BIT=${bitResult}, Naive=${naiveResult}`);
      success = false;
      break;
    }
  }

  if (success) {
    console.log("- 50 Random Range Queries: ALL PASS");
  }

  console.log("\n=== Fenwick Tree Test Finished ===");
};

testFenwickTree();
