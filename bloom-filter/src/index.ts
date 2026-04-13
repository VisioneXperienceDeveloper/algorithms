import { BloomFilter } from "./bloom-filter";
import { CountingBloomFilter } from "./counting-bloom-filter";

/**
 * SCENARIO 1: Standard Bloom Filter Integrity & False Positive Probability
 * Demonstrates that Bloom Filters are 100% reliable for "NO", 
 * but probabilistic for "YES".
 */
const scenarioStandardIntegrity = () => {
  console.log("\n>>> [Scenario 1] Standard Bloom Filter: Integrity & False Positives");
  const m = 500; // Bit array size
  const k = 5;   // Hash functions
  const bf = new BloomFilter(m, k);

  const inserted = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const val = `user_id_${i}`;
    bf.add(val);
    inserted.add(val);
  }

  // 1. Verify 100% Recall (No False Negatives)
  let falseNegatives = 0;
  inserted.forEach(val => {
    if (!bf.contains(val)) falseNegatives++;
  });
  console.log(`- 100% Recall Check: ${falseNegatives === 0 ? "PASS (No False Negatives)" : "FAIL"}`);

  // 2. Measure False Positive Rate
  let falsePositives = 0;
  const testCount = 500;
  for (let i = 100; i < 100 + testCount; i++) {
    const val = `stranger_id_${i}`;
    if (bf.contains(val)) falsePositives++;
  }
  const fpRate = ((falsePositives / testCount) * 100).toFixed(2);
  console.log(`- False Positive Rate with ${inserted.size} items: ${fpRate}% (${falsePositives}/${testCount})`);
  console.log(`- Current Fill Rate: ${bf.getFillRate()}`);
};

/**
 * SCENARIO 2: Counting Bloom Filter Deep-Dive
 * Tests complex adding/removing scenarios and ensures counters don't leak.
 */
const scenarioCountingDeepDive = () => {
  console.log("\n>>> [Scenario 2] Counting Bloom Filter: Complex Add/Remove");
  const cbf = new CountingBloomFilter(100, 3);

  // A. Multi-Key Interleaving
  // 'apple' and 'apply' might share some indices due to prefix similarity
  console.log("- Interleaving keys: 'apple', 'apply'");
  cbf.add("apple");
  cbf.add("apply");
  
  console.log("  Contains 'apple'?:", cbf.contains("apple")); // true
  console.log("  Contains 'apply'?:", cbf.contains("apply")); // true

  cbf.remove("apple");
  console.log("  After removing 'apple':");
  console.log("    Contains 'apple'?:", cbf.contains("apple")); // false
  console.log("    Contains 'apply'?:", cbf.contains("apply")); // Still true! (Testing overlap handling)

  // B. Counter Integrity (Ref counting)
  console.log("- Ref counting: 'banana' added 3 times");
  cbf.add("banana");
  cbf.add("banana");
  cbf.add("banana");

  cbf.remove("banana");
  cbf.remove("banana");
  console.log("  After 2 removes, contains 'banana'?:", cbf.contains("banana")); // Still true (count=1)
  
  cbf.remove("banana");
  console.log("  After 3rd remove, contains 'banana'?:", cbf.contains("banana")); // false (count=0)
  
  const stats = cbf.getStats();
  console.log(`- Final Counter Cleanliness: ${stats.maxCounter === 0 ? "PERFECT (All 0)" : "DIRTY (Still > 0)"}`);
};

/**
 * SCENARIO 3: Stressing the Bit/Counter Distribution
 */
const scenarioDistribution = () => {
  console.log("\n>>> [Scenario 3] Distribution Stress Test");
  const bf = new BloomFilter(100, 7);
  
  console.log("- Flooding the filter to 90% fill rate...");
  for (let i = 0; i < 30; i++) {
    bf.add(`flood_data_${i}`);
  }
  
  console.log(`  Fill Rate: ${bf.getFillRate()}`);
  if (parseFloat(bf.getFillRate()) > 80) {
    console.log("  ⚠️ Warning: High fill rate will cause extreme False Positives.");
  }
  
  const testVal = "unseen_key";
  console.log(`  Checking unseen key '${testVal}':`, bf.contains(testVal) ? "Possible MATCH (Potential FP)" : "NO MATCH (Correct)");
};

const main = () => {
  console.log("=========================================");
  console.log("  BLOOM FILTER COMPREHENSIVE TEST SUITE ");
  console.log("=========================================");
  
  scenarioStandardIntegrity();
  scenarioCountingDeepDive();
  scenarioDistribution();
  
  console.log("\n=========================================");
  console.log("      ALL TEST SCENARIOS COMPLETED      ");
  console.log("=========================================");
};

main();
