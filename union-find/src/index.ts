import { UnionFind } from "./union-find";

const testUnionFind = () => {
  console.log("=== Union-Find (DSU) Comprehensive Test ===");

  // Test 1: Basic Operations
  console.log("\n[Test 1] Basic Operations:");
  const uf = new UnionFind(10);
  console.log("Initial count:", uf.count); // 10

  uf.union(1, 2);
  uf.union(2, 3);
  uf.union(4, 5);

  console.log("Connected(1, 3)?", uf.connected(1, 3)); // true
  console.log("Connected(1, 4)?", uf.connected(1, 4)); // false
  console.log("Current count:", uf.count); // 7

  // Test 2: Social Network Simulation
  console.log("\n[Test 2] Social Network Simulation:");
  const people = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"];
  const network = new UnionFind(people.length);
  
  // Alice - Bob
  network.union(0, 1);
  // Bob - Charlie
  network.union(1, 2);
  // David - Eve
  network.union(3, 4);

  console.log("Is Alice connected to Charlie?", network.connected(0, 2)); // true
  console.log("Is Alice connected to David?", network.connected(0, 3)); // false
  console.log("Total groups in network:", network.count); // 3 ( {A,B,C}, {D,E}, {F} )

  // Test 3: Cycle Detection (Graph)
  console.log("\n[Test 3] Cycle Detection:");
  const graphUF = new UnionFind(4);
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0] // This should complete a cycle
  ];

  for (const [u, v] of edges) {
    if (graphUF.connected(u, v)) {
      console.log(`- Cycle detected! Edge (${u}, ${v}) connects nodes already in the same set.`);
    } else {
      graphUF.union(u, v);
      console.log(`- Edge (${u}, ${v}) added.`);
    }
  }

  // Test 4: Path Compression Efficiency Test
  console.log("\n[Test 4] Path Compression Performance:");
  const size = 1000000; // 1 Million nodes
  const stressUF = new UnionFind(size);
  
  const startTime = Date.now();
  // Create a long chain
  for (let i = 0; i < size - 1; i++) {
    stressUF.union(i, i + 1);
  }
  console.log(`- Joined 1M nodes in a chain: ${Date.now() - startTime}ms`);

  const findStart = Date.now();
  // First time find might take longer, but path compression will kick in
  stressUF.find(0);
  console.log(`- First find(0) (deepest node): ${Date.now() - findStart}ms`);

  const findSecondStart = Date.now();
  stressUF.find(0);
  console.log(`- Second find(0) (now flat): ${Date.now() - findSecondStart}ms`);

  console.log("\n=== Union-Find Test Finished ===");
};

testUnionFind();
