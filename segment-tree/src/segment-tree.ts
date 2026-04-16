/**
 * Segment Tree Implementation (Range Sum Query)
 * 
 * Time Complexities:
 * - Build: O(N)
 * - Update: O(log N)
 * - Query: O(log N)
 */
export class SegmentTree {
  private tree: Float64Array;
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    /**
     * A common rule of thumb for the size of a segment tree array 
     * is 4 * n to accommodate the tree structure.
     */
    this.tree = new Float64Array(4 * this.n);
    if (this.n > 0) {
      this.build(arr, 1, 0, this.n - 1);
    }
  }

  /**
   * Recursively builds the segment tree.
   * @param arr Original array
   * @param node Current index in the tree array
   * @param start Start index in the original array
   * @param end End index in the original array
   */
  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      // Leaf node: stores the actual value from the array
      this.tree[node] = arr[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node;
    const rightChild = 2 * node + 1;

    // Recursively build left and right subtrees
    this.build(arr, leftChild, start, mid);
    this.build(arr, rightChild, mid + 1, end);

    // Parent node stores the sum of its children
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  /**
   * Updates a value at a specific index.
   * @param index Original array index (0-based)
   * @param val New value
   */
  update(index: number, val: number): void {
    if (index < 0 || index >= this.n) return;
    this.updateRecursive(1, 0, this.n - 1, index, val);
  }

  private updateRecursive(node: number, start: number, end: number, idx: number, val: number): void {
    if (start === end) {
      // Reached the leaf node to be updated
      this.tree[node] = val;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node;
    const rightChild = 2 * node + 1;

    if (idx <= mid) {
      this.updateRecursive(leftChild, start, mid, idx, val);
    } else {
      this.updateRecursive(rightChild, mid + 1, end, idx, val);
    }

    // After updating the child, update the current parent node
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  /**
   * Queries the sum in range [l, r] (0-based, inclusive).
   */
  query(l: number, r: number): number {
    if (l < 0 || r >= this.n || l > r) return 0;
    return this.queryRecursive(1, 0, this.n - 1, l, r);
  }

  private queryRecursive(node: number, start: number, end: number, l: number, r: number): number {
    // 1. Fully outside: Range [l, r] does not overlap with [start, end]
    if (r < start || end < l) {
      return 0;
    }

    // 2. Fully inside: Range [start, end] is completely contained within [l, r]
    if (l <= start && end <= r) {
      return this.tree[node];
    }

    // 3. Partial overlap: Split and combine
    const mid = Math.floor((start + end) / 2);
    const leftSum = this.queryRecursive(2 * node, start, mid, l, r);
    const rightSum = this.queryRecursive(2 * node + 1, mid + 1, end, l, r);

    return leftSum + rightSum;
  }

  /**
   * Basic visualization of the internal tree array
   */
  dump(): void {
    console.log("Segment Tree Internal Array (First bits):");
    // Show only active nodes for clarity
    const limit = Math.min(this.tree.length, 32); 
    console.log(this.tree.slice(0, limit).toString());
  }
}
