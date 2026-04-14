import { SkipList } from "./skip-list";
import { SortedSet } from "./sorted-set";

/**
 * SCENARIO 1: Skip List Structural Integrity (Fixed with Unique Keys)
 */
const scenarioSkipListIntegrity = () => {
  console.log("\n>>> [Scenario 1] Skip List: Structural Integrity (Unique Keys)");
  const list = new SkipList<number>();
  
  // Use a Set to ensure 50 unique random keys
  const uniqueKeysSet = new Set<number>();
  while (uniqueKeysSet.size < 50) {
    uniqueKeysSet.add(Math.floor(Math.random() * 2000));
  }
  const keys = Array.from(uniqueKeysSet);
  
  // 1. Bulk Insert
  keys.forEach(k => list.insert(k, k * 10));
  console.log(`- Inserted 50 unique keys.`);

  // 2. Sortedness Check (Level 0)
  let curr: any = (list as any).head.next[0];
  let isSorted = true;
  while (curr && curr.next[0]) {
    if (curr.key >= curr.next[0].key) {
      isSorted = false;
      break;
    }
    curr = curr.next[0];
  }
  console.log(`- Level 0 Sortedness Check: ${isSorted ? "PASS" : "FAIL"}`);

  // 3. Delete exactly 25 items and verify
  const toDelete = keys.slice(0, 25);
  const toKeep = keys.slice(25);
  
  toDelete.forEach(k => list.delete(k));
  
  let deletedKeysFound = 0;
  toDelete.forEach(k => { if (list.search(k) !== null) deletedKeysFound++; });
  
  let remainingKeysNotFound = 0;
  toKeep.forEach(k => { if (list.search(k) === null) remainingKeysNotFound++; });

  console.log(`- Deletion Verification (Should be 0 found): ${deletedKeysFound === 0 ? "PASS" : "FAIL"}`);
  console.log(`- Remaining Persistence (Should be 0 missed): ${remainingKeysNotFound === 0 ? "PASS" : "FAIL"}`);
  
  list.dump();
};

const scenarioSortedSetLeaderboard = () => {
  console.log("\n>>> [Scenario 2] Sorted Set: Real-time Leaderboard Simulation");
  const zset = new SortedSet();
  const players = ["UserA", "UserB", "UserC", "UserD", "UserE"];
  players.forEach(p => zset.zadd(p, Math.floor(Math.random() * 100)));
  zset.zrange();
  console.log("\n- Updating UserB (999 pts) and UserE (1 pt)");
  zset.zadd("UserB", 999);
  zset.zadd("UserE", 1);
  zset.zrange();
  console.log(`\n- Final Score Probe for UserB: ${zset.zscore("UserB")} (Should be 999)`);
};

const scenarioEdgeCases = () => {
  console.log("\n>>> [Scenario 3] Edge Case Handling");
  const list = new SkipList<string>();
  console.log("- Deleting from empty list:", list.delete(999) === false ? "OK" : "FAIL");
  console.log("- Searching non-existent key:", list.search(123) === null ? "OK" : "FAIL");
  list.insert(1, "one");
  list.insert(1, "updated_one");
  console.log("- Duplicate key update:", list.search(1) === "updated_one" ? "OK" : "FAIL");
};

const main = () => {
  console.log("=========================================");
  console.log("   SKIP LIST & SORTED SET TEST SUITE    ");
  console.log("=========================================");
  scenarioSkipListIntegrity();
  scenarioSortedSetLeaderboard();
  scenarioEdgeCases();
  console.log("\n=========================================");
  console.log("      ALL TEST SCENARIOS COMPLETED      ");
  console.log("=========================================");
};

main();
