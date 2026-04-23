/**
 * Suffix Array implementation with LCP Array (Kasai's Algorithm)
 */
export class SuffixArray {
  private readonly text: string;
  private readonly n: number;
  public readonly sa: Int32Array; // Suffix Array
  public readonly lcp: Int32Array; // LCP Array

  constructor(text: string) {
    this.text = text;
    this.n = text.length;
    this.sa = this.buildSA();
    this.lcp = this.buildLCP();
  }

  /**
   * Build Suffix Array using O(N log^2 N) Prefix Doubling
   * (Easy to implement and reliable for N up to ~10^5)
   */
  private buildSA(): Int32Array {
    const n = this.n;
    let sa = new Int32Array(n);
    let rank = new Int32Array(n);
    let tmp = new Int32Array(n);

    // Initial rank based on first character
    for (let i = 0; i < n; i++) {
      sa[i] = i;
      rank[i] = this.text.charCodeAt(i);
    }

    for (let k = 1; k < n; k <<= 1) {
      const compare = (i: number, j: number) => {
        if (rank[i] !== rank[j]) return rank[i] - rank[j];
        const ri = i + k < n ? rank[i + k] : -1;
        const rj = j + k < n ? rank[j + k] : -1;
        return ri - rj;
      };

      // Native sort is fine for O(N log^2 N)
      sa.sort(compare);

      // Re-rank
      tmp[sa[0]] = 0;
      for (let i = 1; i < n; i++) {
        tmp[sa[i]] = tmp[sa[i - 1]] + (compare(sa[i - 1], sa[i]) < 0 ? 1 : 0);
      }
      for (let i = 0; i < n; i++) rank[i] = tmp[i];

      if (rank[sa[n - 1]] === n - 1) break; // All suffixes are uniquely ranked
    }

    return sa;
  }

  /**
   * Build LCP Array using Kasai's Algorithm in O(N)
   */
  private buildLCP(): Int32Array {
    const n = this.n;
    const lcp = new Int32Array(n);
    const rank = new Int32Array(n);

    for (let i = 0; i < n; i++) rank[this.sa[i]] = i;

    let h = 0;
    for (let i = 0; i < n; i++) {
      if (rank[i] > 0) {
        const j = this.sa[rank[i] - 1];
        if (h > 0) h--;
        while (i + h < n && j + h < n && this.text[i + h] === this.text[j + h]) {
          h++;
        }
        lcp[rank[i]] = h;
      }
    }
    return lcp;
  }

  /**
   * Search for pattern occurrence range [LowerBound, UpperBound)
   * Time complexity: O(M log N)
   */
  public search(pattern: string): [number, number] {
    const m = pattern.length;
    if (m === 0) return [0, 0];

    // Lower bound
    let low = 0, high = this.n;
    while (low < high) {
      const mid = (low + high) >>> 1;
      const suffix = this.text.substring(this.sa[mid], this.sa[mid] + m);
      if (suffix < pattern) low = mid + 1;
      else high = mid;
    }
    const L = low;

    // Upper bound
    high = this.n;
    while (low < high) {
      const mid = (low + high) >>> 1;
      const suffix = this.text.substring(this.sa[mid], this.sa[mid] + m);
      if (suffix <= pattern) low = mid + 1;
      else high = mid;
    }
    const R = low;

    return [L, R];
  }

  /**
   * Get Longest Repeated Substring
   */
  public getLongestRepeatedSubstring(): string {
    let maxLen = 0;
    let index = -1;
    for (let i = 1; i < this.n; i++) {
      if (this.lcp[i] > maxLen) {
        maxLen = this.lcp[i];
        index = this.sa[i];
      }
    }
    return index === -1 ? "" : this.text.substring(index, index + maxLen);
  }

  public dump(): void {
    console.log("Idx | SA | LCP | Suffix");
    console.log("-----------------------");
    for (let i = 0; i < this.n; i++) {
      const suffix = this.text.substring(this.sa[i]).replace(/\n/g, "\\n");
      const displaySuffix = suffix.length > 30 ? suffix.substring(0, 27) + "..." : suffix;
      console.log(
        `${i.toString().padStart(3)} | ${this.sa[i].toString().padStart(2)} | ${this.lcp[i].toString().padStart(3)} | ${displaySuffix}`
      );
    }
  }
}
