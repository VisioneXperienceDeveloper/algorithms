import { SuffixArray } from "./suffix-array";
import { SuffixTree } from "./suffix-tree";

const testSuffixArray = () => {
  console.log("=== Suffix Array / Tree Comprehensive Test ===");
  
  const text = "banana$";
  console.log(`\n[Test 1] Analyzing Text: "${text}"`);
  const sa = new SuffixArray(text);
  sa.dump();

  // Search Verification
  const patterns = ["ana", "nan", "ba", "xyz"];
  console.log("\n[Test 2] Pattern Search:");
  patterns.forEach(p => {
    const [L, R] = sa.search(p);
    const count = R - L;
    const positions = [];
    for (let i = L; i < R; i++) positions.push(sa.sa[i]);
    console.log(`- Pattern "${p}": found ${count} times at indices [${positions.join(", ")}]`);
  });

  // Longest Repeated Substring
  console.log("\n[Test 3] Longest Repeated Substring:");
  console.log(`- Found: "${sa.getLongestRepeatedSubstring()}"`);

  // Mississippi Test
  const complexText = "mississippi$";
  console.log(`\n[Test 4] Analyzing Complex Text: "${complexText}"`);
  const saComplex = new SuffixArray(complexText);
  saComplex.dump();
  console.log(`- Longest Repeated Substring: "${saComplex.getLongestRepeatedSubstring()}"`);

  // Suffix Tree Verification
  console.log("\n[Test 5] Suffix Tree Construction:");
  const tree = new SuffixTree("banana$");
  tree.dump();

  console.log("\n=== Suffix Array/Tree Test Finished ===");
};

testSuffixArray();
