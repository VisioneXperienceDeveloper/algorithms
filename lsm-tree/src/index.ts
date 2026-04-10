import { LSMTree } from "./lsm-tree";

const main = () => {
  console.log("=== LSM Tree Implementation Test ===");

  // Thresholds: MemTable=3 items, Compact once 3 SSTables exist
  const lsm = new LSMTree(3, 3);

  // 1. Initial writes
  console.log("\n[Step 1] Initial Writes");
  lsm.set("key1", "value1");
  lsm.set("key2", "value2");
  lsm.dump(); // Still in MemTable

  // 2. Trigger first flush
  console.log("\n[Step 2] Triggering Flush");
  lsm.set("key3", "value3"); // MemTable size reaches 3 -> Flushes key1,2,3 to SSTable 0
  lsm.dump();

  // 3. New writes and search
  console.log("\n[Step 3] Search Across Levels");
  lsm.set("key4", "value4");
  console.log("Search 'key1' (in SSTable):", lsm.get("key1")); // Should be value1
  console.log("Search 'key4' (in MemTable):", lsm.get("key4")); // Should be value4

  // 4. Overwrite and Delete
  console.log("\n[Step 4] Overwrite & Delete (Tombstone)");
  lsm.set("key1", "updated_value1"); // Overwrites in MemTable
  lsm.delete("key2"); // Deletes in MemTable (Tombstone)
  lsm.dump();
  
  console.log("Search 'key1' (Updated):", lsm.get("key1")); // updated_value1
  console.log("Search 'key2' (Deleted):", lsm.get("key2")); // null

  // 5. Triggering more flushes to reach Compaction
  console.log("\n[Step 5] Triggering Compaction");
  lsm.set("key5", "value5"); // triggers flush of key1,2,5 -> SSTable 1. (Total SSTs: 2)
  lsm.set("key6", "value6");
  lsm.set("key7", "value7");
  lsm.set("key8", "value8"); // triggers flush of key6,7,8 -> SSTable 2. (Total SSTs: 3) 
                             // -> This should trigger Compaction if threshold=3
  
  lsm.dump();
  
  console.log("Search 'key1' after Compaction:", lsm.get("key1"));
  console.log("Search 'key2' after Compaction:", lsm.get("key2")); // Should still be null
  console.log("Search 'key8' after Compaction:", lsm.get("key8"));

  console.log("\n=== LSM Tree Test Finished ===");
};

main();
