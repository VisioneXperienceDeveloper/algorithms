import { SparseTableFactory } from "./sparse-table";

const runTest = () => {
  console.log("=== Sparse Table Comprehensive Test & Benchmark ===");

  const N = 100000;
  const Q = 1000000;
  const data = Array.from({ length: N }, () => Math.floor(Math.random() * 1000000));

  // 1. Preprocessing Time
  console.log(`\n[Step 1] Preprocessing N=${N.toLocaleString()} elements...`);
  const buildStart = performance.now();
  const st = SparseTableFactory.createMin(data);
  const buildEnd = performance.now();
  console.log(`- Preprocessing completed in ${(buildEnd - buildStart).toFixed(2)}ms`);

  // 2. Correctness Verification
  console.log("\n[Step 2] Verifying correctness against Naive O(N) approach...");
  let isCorrect = true;
  for (let i = 0; i < 100; i++) {
    const L = Math.floor(Math.random() * N);
    const R = Math.floor(Math.random() * (N - L)) + L;
    
    const expected = Math.min(...data.slice(L, R + 1));
    const actual = st.query(L, R);
    
    if (expected !== actual) {
      console.error(`- Mismatch at [${L}, ${R}]: Expected ${expected}, Actual ${actual}`);
      isCorrect = false;
      break;
    }
  }
  if (isCorrect) console.log("- Correctness check: PASS");

  // 3. Query Benchmark
  console.log(`\n[Step 3] Benchmarking Q=${Q.toLocaleString()} random queries...`);
  const queryStart = performance.now();
  let dummySum = 0;
  for (let i = 0; i < Q; i++) {
    const L = Math.floor(Math.random() * N);
    const R = Math.floor(Math.random() * (N - L)) + L;
    dummySum += st.query(L, R);
  }
  const queryEnd = performance.now();
  console.log(`- ${Q.toLocaleString()} queries completed in ${(queryEnd - queryStart).toFixed(2)}ms`);
  console.log(`- Average query time: ${((queryEnd - queryStart) / Q * 1000).toFixed(4)} nanoseconds`);

  // 4. Other Operations (GCD)
  console.log("\n[Step 4] Testing GCD operation...");
  const gcdData = [12, 18, 24, 30, 36];
  const gcdSt = SparseTableFactory.createGcd(gcdData);
  console.log(`- Data: [${gcdData.join(", ")}]`);
  console.log(`- GCD of [0, 2] (12, 18, 24): ${gcdSt.query(0, 2)} (Expected: 6)`);
  console.log(`- GCD of [2, 4] (24, 30, 36): ${gcdSt.query(2, 4)} (Expected: 6)`);

  console.log("\n=== Sparse Table Test Finished ===");
};

runTest();
