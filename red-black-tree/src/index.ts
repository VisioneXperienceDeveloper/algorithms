import { RedBlackTree } from "./red-black-tree";

const testRedBlackTree = () => {
  console.log("=== Red-Black Tree Comprehensive Test ===");
  const tree = new RedBlackTree<number, string>();

  // 1. Basic Insertion
  console.log("\n[Test 1] Sequential Insertion (Triggering rotations):");
  [10, 20, 30, 40, 50].forEach(k => {
    tree.insert(k, `val_${k}`);
    console.log(`Inserted ${k}, properties valid: ${tree.verifyProperties()}`);
  });
  tree.dump();

  // 2. Random Stress Test (Insertion)
  console.log("\n[Test 2] Stress Test: 100 Random Insertions");
  const keys = new Set<number>();
  while (keys.size < 100) {
    keys.add(Math.floor(Math.random() * 1000));
  }
  
  let insertSuccess = true;
  for (const k of keys) {
    tree.insert(k, `val_${k}`);
    if (!tree.verifyProperties()) {
      insertSuccess = false;
      break;
    }
  }
  console.log(`- 100 insertions integrity: ${insertSuccess ? "PASS" : "FAIL"}`);

  // 3. Deletion Test
  console.log("\n[Test 3] Deletion Test: Removing 50 random keys");
  const keysArray = Array.from(keys);
  let deleteSuccess = true;
  for (let i = 0; i < 50; i++) {
    const k = keysArray[i];
    tree.delete(k);
    if (!tree.verifyProperties()) {
      console.error(`- Failed after deleting ${k}`);
      deleteSuccess = false;
      break;
    }
  }
  console.log(`- 50 deletions integrity: ${deleteSuccess ? "PASS" : "FAIL"}`);

  // 4. Search Verification
  console.log("\n[Test 4] Search Verification:");
  const remainingKey = keysArray[60];
  const found = tree.search(remainingKey);
  console.log(`- Searching for ${remainingKey}: ${found === `val_${remainingKey}` ? "CORRECT" : "WRONG"}`);
  
  const deletedKey = keysArray[0];
  const foundDeleted = tree.search(deletedKey);
  console.log(`- Searching for deleted ${deletedKey}: ${foundDeleted === null ? "CORRECT (Not found)" : "WRONG"}`);

  console.log("\n=== Red-Black Tree Test Finished ===");
};

testRedBlackTree();
