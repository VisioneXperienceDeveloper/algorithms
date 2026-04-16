/**
 * Fenwick Tree (Binary Indexed Tree) Implementation
 * 
 * Provides efficient O(log N) prefix sums and point updates.
 * Also very space efficient, using O(N) extra space.
 */
export class FenwickTree {
  private tree: Float64Array;
  private n: number;

  constructor(size: number) {
    this.n = size;
    // 1-based indexing for BIT logic
    this.tree = new Float64Array(size + 1);
  }

  /**
   * Builds a Fenwick Tree from an initial array.
   */
  static fromArray(arr: number[]): FenwickTree {
    const ft = new FenwickTree(arr.length);
    for (let i = 0; i < arr.length; i++) {
        ft.add(i, arr[i]);
    }
    return ft;
  }

  /**
   * Adds 'delta' to the element at 'index' (0-based).
   */
  add(index: number, delta: number): void {
    let i = index + 1; // Convert to 1-based
    while (i <= this.n) {
      this.tree[i] += delta;
      /**
       * (i & -i) gets the least significant bit (LSB).
       * Moving up to parents: add LSB.
       */
      i += (i & -i);
    }
  }

  /**
   * Returns prefix sum from index 0 to 'index' (0-based, inclusive).
   */
  query(index: number): number {
    let i = index + 1; // Convert to 1-based
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      /**
       * Moving down to sub-ranges: subtract LSB.
       */
      i -= (i & -i);
    }
    return sum;
  }

  /**
   * Returns range sum from 'l' to 'r' (0-based, inclusive).
   */
  queryRange(l: number, r: number): number {
    if (l < 0 || r >= this.n || l > r) return 0;
    if (l === 0) return this.query(r);
    return this.query(r) - this.query(l - 1);
  }

  /**
   * Internal array dump for debugging
   */
  dump(): void {
    console.log("Fenwick Tree Internal Array (1-indexed):");
    console.log(this.tree.slice(1).toString());
  }
}
