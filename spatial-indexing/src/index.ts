import { QuadTree, Rectangle, Point2D } from "./quadtree";
import { Octree, Box, Point3D } from "./octree";

const runBenchmark = () => {
  console.log("=== Spatial Indexing (QuadTree/Octree) Benchmark ===");

  // --- QuadTree Test ---
  const N = 100000;
  const boundary = new Rectangle(500, 500, 500, 500); // 1000x1000 area
  const qt = new QuadTree(boundary, 16);

  console.log(`\n[QuadTree] Inserting ${N.toLocaleString()} points...`);
  const points: Point2D[] = [];
  const startInsert = performance.now();
  for (let i = 0; i < N; i++) {
    const p = { x: Math.random() * 1000, y: Math.random() * 1000 };
    points.push(p);
    qt.insert(p);
  }
  console.log(`- Insertion took: ${(performance.now() - startInsert).toFixed(2)}ms`);

  const queryRange = new Rectangle(500, 500, 50, 50); // 100x100 range in the middle
  console.log(`[QuadTree] Querying points in 100x100 range...`);

  // QuadTree Query
  const startQtQuery = performance.now();
  const qtResult = qt.query(queryRange);
  const endQtQuery = performance.now();

  // Naive Scan
  const startNaive = performance.now();
  const naiveResult = points.filter(p => queryRange.contains(p));
  const endNaive = performance.now();

  console.log(`- QuadTree Query: ${(endQtQuery - startQtQuery).toFixed(4)}ms (Found ${qtResult.length} points)`);
  console.log(`- Naive Scan Query: ${(endNaive - startNaive).toFixed(4)}ms (Found ${naiveResult.length} points)`);
  console.log(`- Speedup: ${((endNaive - startNaive) / (endQtQuery - startQtQuery)).toFixed(2)}x faster`);

  // --- Octree Test ---
  const box = new Box(50, 50, 50, 50, 50, 50); // 100x100x100 box
  const oct = new Octree(box, 16);
  console.log(`\n[Octree] Inserting 50,000 3D points...`);
  const startOctInsert = performance.now();
  for (let i = 0; i < 50000; i++) {
    oct.insert({ 
      x: Math.random() * 100, 
      y: Math.random() * 100, 
      z: Math.random() * 100 
    });
  }
  console.log(`- Insertion took: ${(performance.now() - startOctInsert).toFixed(2)}ms`);

  const queryBox = new Box(50, 50, 50, 10, 10, 10);
  const startOctQuery = performance.now();
  const octResult = oct.query(queryBox);
  console.log(`- Octree Query (20x20x20): ${(performance.now() - startOctQuery).toFixed(4)}ms (Found ${octResult.length} points)`);

  console.log("\n=== Spatial Indexing Test Finished ===");
};

runBenchmark();
