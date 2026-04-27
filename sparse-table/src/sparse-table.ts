/**
 * Sparse Table for O(1) Range Queries on Static Arrays
 */
export class SparseTable<T> {
  private st: T[][];
  private logs: Int32Array;
  private readonly combine: (a: T, b: T) => T;

  constructor(data: T[], combine: (a: T, b: T) => T) {
    const n = data.length;
    const k = Math.floor(Math.log2(n)) + 1;
    this.combine = combine;

    // 1. Precompute logs for O(1) query
    this.logs = new Int32Array(n + 1);
    this.logs[1] = 0;
    for (let i = 2; i <= n; i++) {
      this.logs[i] = this.logs[(i / 2) | 0] + 1;
    }

    // 2. Build Sparse Table: O(N log N)
    this.st = Array.from({ length: k }, () => []);

    // Base case: range of length 2^0 = 1
    for (let i = 0; i < n; i++) {
      this.st[0][i] = data[i];
    }

    // DP: st[j][i] = combine(st[j-1][i], st[j-1][i + 2^(j-1)])
    for (let j = 1; j < k; j++) {
      for (let i = 0; i + (1 << j) <= n; i++) {
        this.st[j][i] = this.combine(
          this.st[j - 1][i],
          this.st[j - 1][i + (1 << (j - 1))]
        );
      }
    }
  }

  /**
   * Range Query in O(1)
   * Note: The combine function must be idempotent (e.g., min, max, gcd)
   */
  public query(L: number, R: number): T {
    if (L > R) throw new Error("Invalid range: L must be <= R");
    const j = this.logs[R - L + 1];
    return this.combine(this.st[j][L], this.st[j][R - (1 << j) + 1]);
  }
}

/**
 * Concrete implementation for Common Operations
 */
export const SparseTableFactory = {
  createMin(data: number[]): SparseTable<number> {
    return new SparseTable(data, Math.min);
  },
  createMax(data: number[]): SparseTable<number> {
    return new SparseTable(data, Math.max);
  },
  createGcd(data: number[]): SparseTable<number> {
    const gcd = (a: number, b: number): number => {
      a = Math.abs(a);
      b = Math.abs(b);
      while (b) {
        a %= b;
        [a, b] = [b, a];
      }
      return a;
    };
    return new SparseTable(data, gcd);
  }
};
