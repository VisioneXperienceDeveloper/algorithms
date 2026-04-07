import { BTree } from "./b-tree";

function testBTree() {
  const tree = new BTree(3); // minimum degree t = 3
  
  console.log("--- B-Tree Functional Test ---");

  // 1. Insertion Test
  const keysToInsert = [10, 20, 5, 6, 12, 30, 7, 17, 3, 1, 4, 15, 25, 35, 40, 50, 60, 70, 80, 90, 100];
  console.log(`Inserting ${keysToInsert.length} keys...`);
  keysToInsert.forEach(key => tree.insert(key));

  // 2. Search Test (Existing and Non-existing)
  const existingKeys = [10, 30, 100, 5, 1];
  const nonExistingKeys = [0, 11, 31, 101];
  
  let searchFailed = false;
  existingKeys.forEach(k => {
    if (!tree.search(k)) {
      console.error(`Error: Key ${k} should be found but isn't.`);
      searchFailed = true;
    }
  });
  nonExistingKeys.forEach(k => {
    if (tree.search(k)) {
      console.error(`Error: Key ${k} should not be found but is.`);
      searchFailed = true;
    }
  });
  
  if (!searchFailed) console.log("✓ Search tests passed.");

  // 3. Deletion Test
  const keysToDelete = [10, 30, 100, 5, 1, 50, 60];
  console.log(`Deleting keys: ${keysToDelete.join(", ")}...`);
  keysToDelete.forEach(k => tree.delete(k));

  let deleteFailed = false;
  keysToDelete.forEach(k => {
    if (tree.search(k)) {
      console.error(`Error: Key ${k} should have been deleted but was found.`);
      deleteFailed = true;
    }
  });

  if (!deleteFailed) console.log("✓ Deletion integrity tests passed.");

  // 4. Large scale sanity check
  const largeTree = new BTree(2); // t=2 is the minimum possible t for a B-tree (Binary split)
  const largeKeys = Array.from({length: 100}, (_, i) => i);
  largeKeys.forEach(k => largeTree.insert(k));
  
  let largeTestFailed = false;
  largeKeys.forEach(k => {
    if (!largeTree.search(k)) {
      largeTestFailed = true;
    }
  });
  if (!largeTestFailed) console.log("✓ Large scale (t=2, 100 keys) sanity check passed.");

  console.log("--- Test Complete ---");
}

testBTree();
