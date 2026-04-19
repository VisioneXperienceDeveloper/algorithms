/**
 * Union-Find (Disjoint Set Union) Implementation
 * 
 * Optimized with:
 * 1. Path Compression: Flattens the structure during 'find'
 * 2. Union by Rank: Keeps the tree shallow during 'union'
 * 
 * Time Complexity: O(α(N)) amortized per operation, 
 * where α is the inverse Ackermann function (nearly O(1)).
 */
export class UnionFind {
  private parent: Int32Array;
  private rank: Int32Array;
  private _count: number;

  constructor(n: number) {
    this.parent = new Int32Array(n);
    this.rank = new Int32Array(n);
    this._count = n;

    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.rank[i] = 0;
    }
  }

  /**
   * Finds the root of the set containing element 'i'.
   * Applies path compression to flatten the structure.
   */
  find(i: number): number {
    if (this.parent[i] === i) {
      return i;
    }
    // Path Compression: directly connect node to its root
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  /**
   * Joins the sets containing 'i' and 'j'.
   * Returns true if a new connection was made.
   */
  union(i: number, j: number): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ) {
      return false; // Already in the same set
    }

    // Union by Rank: attach the smaller tree under the larger tree
    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootI] = rootJ;
      this.rank[rootJ]++;
    }

    this._count--;
    return true;
  }

  /**
   * Returns true if 'i' and 'j' belong to the same set.
   */
  connected(i: number, j: number): boolean {
    return this.find(i) === this.find(j);
  }

  /**
   * Returns the number of disjoint sets.
   */
  get count(): number {
    return this._count;
  }
}
