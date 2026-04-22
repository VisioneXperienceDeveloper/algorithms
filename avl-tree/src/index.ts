import { AVLTree } from "./avl-tree";
import { RedBlackTree } from "../../red-black-tree/src/red-black-tree";

const testAVLTree = () => {
  console.log("=== AVL Tree Comprehensive Test ===");
  const avl = new AVLTree<number, string>();

  // 1. Basic Balance Check (Sequential Insertion)
  console.log("\n[Test 1] Sequential Insertion (Triggering rotations):");
  [10, 20, 30, 40, 50, 25].forEach(k => {
    avl.insert(k, `val_${k}`);
    console.log(`Inserted ${k}, Balanced: ${avl.verifyBalance()}`);
  });
  avl.dump();

  // 2. Random Stress Test (Insertion)
  console.log("\n[Test 2] Stress Test: 1,000 Random Insertions");
  const keys = new Set<number>();
  while (keys.size < 1000) {
    keys.add(Math.floor(Math.random() * 10000));
  }
  
  let insertSuccess = true;
  for (const k of keys) {
    avl.insert(k, `val_${k}`);
    if (!avl.verifyBalance()) {
      insertSuccess = false;
      break;
    }
  }
  console.log(`- 1,000 insertions integrity: ${insertSuccess ? "PASS" : "FAIL"}`);
  console.log(`- Current AVL Height for 1000 nodes: ${avl.getDepth()}`);

  // 3. Comparison with Red-Black Tree
  console.log("\n[Test 3] Comparison: AVL vs Red-Black Tree (1,000 nodes)");
  const rbTree = new RedBlackTree<number, string>();
  for (const k of keys) {
    rbTree.insert(k, `val_${k}`);
  }
  
  // To get RB height, we need to inspect the root. 
  // Let's add a quick depth calculation helper or measure via recursive call.
  const getRBDepth = (node: any): number => {
    if (node.key === null) return 0; // NIL sentinel
    return 1 + Math.max(getRBDepth(node.left), getRBDepth(node.right));
  };
  const rbDepth = getRBDepth((rbTree as any).root);
  
  console.log(`- AVL Height: ${avl.getDepth()}`);
  console.log(`- RB-Tree Height: ${rbDepth}`);
  console.log(`- Result: AVL is ${avl.getDepth() <= rbDepth ? "STRICKER or EQUAL" : "LOOSER"} (Expect: AVL <= RB)`);

  // 4. Deletion Test
  console.log("\n[Test 4] Deletion Test: Removing 500 keys");
  const keysArray = Array.from(keys);
  let deleteSuccess = true;
  for (let i = 0; i < 500; i++) {
    avl.delete(keysArray[i]);
    if (!avl.verifyBalance()) {
      deleteSuccess = false;
      break;
    }
  }
  console.log(`- 500 deletions integrity: ${deleteSuccess ? "PASS" : "FAIL"}`);
  console.log(`- Final Depth: ${avl.getDepth()}`);

  console.log("\n=== AVL Tree Test Finished ===");
};

testAVLTree();
