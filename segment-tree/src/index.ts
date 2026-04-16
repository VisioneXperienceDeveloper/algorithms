import { SegmentTree } from "./segment-tree";

const testSegmentTree = () => {
  console.log("=== Segment Tree Comprehensive Test ===");
  
  const arr = [1, 3, 5, 7, 9, 11];
  console.log(`Initial Array: [${arr.join(", ")}]`);
  
  const st = new SegmentTree(arr);
  st.dump();

  // Test 1: Initial Range Sum Queries
  console.log("\n[Test 1] Initial Range Sum Queries:");
  console.log("Query (0, 2):", st.query(0, 2)); // 1 + 3 + 5 = 9
  console.log("Query (1, 3):", st.query(1, 3)); // 3 + 5 + 7 = 15
  console.log("Query (0, 5):", st.query(0, 5)); // sum of all = 36

  // Test 2: Point Updates
  console.log("\n[Test 2] Point Updates:");
  console.log("Update Index 2 to 10 (was 5)");
  st.update(2, 10);
  console.log("New Query (0, 2):", st.query(0, 2)); // 1 + 3 + 10 = 14
  console.log("New Query (1, 3):", st.query(1, 3)); // 3 + 10 + 7 = 20
  console.log("New Query (0, 5):", st.query(0, 5)); // 36 - 5 + 10 = 41

  // Test 3: Large Random Data Verification
  console.log("\n[Test 3] Stress Test with Random Data:");
  const largeArr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100));
  const stLarge = new SegmentTree(largeArr);
  
  let success = true;
  for (let i = 0; i < 10; i++) {
    const l = Math.floor(Math.random() * 500);
    const r = l + Math.floor(Math.random() * 400);
    
    const treeResult = stLarge.query(l, r);
    const naiveResult = largeArr.slice(l, r + 1).reduce((a, b) => a + b, 0);
    
    if (treeResult !== naiveResult) {
      console.error(`- Mismatch at (${l}, ${r}): Tree=${treeResult}, Naive=${naiveResult}`);
      success = false;
      break;
    }
  }
  if (success) {
    console.log("- 10 Random Range Queries: ALL PASS");
  }

  // Test 4: Performance of 10,000 updates
  console.log("\n[Test 4] Performance Test (10,000 updates):");
  const startTime = Date.now();
  for (let i = 0; i < 10000; i++) {
    const idx = Math.floor(Math.random() * 1000);
    stLarge.update(idx, Math.floor(Math.random() * 100));
  }
  console.log(`- 10,000 updates completed in ${Date.now() - startTime}ms`);

  console.log("\n=== Segment Tree Test Finished ===");
};

testSegmentTree();
