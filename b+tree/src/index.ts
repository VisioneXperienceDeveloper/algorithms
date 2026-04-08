import { BPlusTree } from "./b+tree";

function testBPlusTreeFinal() {
  const t = 3; 
  // Max keys: 2t - 1 = 5
  // Min keys: t - 1 = 2
  const tree = new BPlusTree(t); // Starts as leaf by default
  
  console.log(`=== B+ Tree Final Verification (t=${t}) ===`);

  // 1. Bulk Insertion to force hierarchy
  const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  console.log("INSERT: " + data.join(", "));
  data.forEach(d => tree.insert(d));
  tree.dump();
  tree.print();

  // 2. Search validation (Search boundary keys and internal separators)
  const searchItems = [10, 50, 60, 100, 30, 0];
  console.log("\nSEARCH:");
  searchItems.forEach(s => {
    console.log(`- Find ${s}: ${tree.search(s) ? "Found" : "Not Found"}`);
  });

  // 3. Sequential deletion to trigger borrow/merge
  console.log("\nDELETE:");
  const deleteItems = [10, 20, 30, 40, 50]; // This will significantly reduce the tree size
  deleteItems.forEach(d => {
    console.log(`> Deleting ${d}...`);
    tree.delete(d);
    tree.dump();
  });

  console.log("\nFINAL STATUS:");
  tree.dump();
  tree.print();
  
  console.log("\n=== Test Finished ===");
}

testBPlusTreeFinal();
