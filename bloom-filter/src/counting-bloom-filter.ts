/**
 * Counting Bloom Filter Implementation
 * 
 * Unlike standard Bloom Filter, it supports DELETION by using 
 * counters instead of simple bits.
 */
export class CountingBloomFilter {
  private counterArray: Uint8Array;
  private size: number;
  private hashCount: number;

  constructor(size: number = 100, hashCount: number = 3) {
    this.size = size;
    this.hashCount = hashCount;
    // Each position is now a counter (0-255 since we use Uint8Array)
    this.counterArray = new Uint8Array(size);
  }

  /**
   * Adds an item by incrementing counters at generated indices.
   */
  add(item: string): void {
    const indices = this.getIndices(item);
    indices.forEach(index => {
      // Prevent overflow (max value 255 for Uint8Array)
      if (this.counterArray[index] < 255) {
        this.counterArray[index]++;
      }
    });
  }

  /**
   * Removes an item by decrementing counters at generated indices.
   * Note: Only call remove for items that were definitely added!
   */
  remove(item: string): boolean {
    if (!this.contains(item)) return false;

    const indices = this.getIndices(item);
    indices.forEach(index => {
      if (this.counterArray[index] > 0) {
        this.counterArray[index]--;
      }
    });
    return true;
  }

  /**
   * Checks if an item might be present.
   * Returns true if all counters are > 0.
   */
  contains(item: string): boolean {
    const indices = this.getIndices(item);
    return indices.every(index => this.counterArray[index] > 0);
  }

  /**
   * Hash Generation (Double Hashing)
   */
  private getIndices(item: string): number[] {
    const h1 = this.fnv1a(item);
    const h2 = this.djb2(item);
    const indices: number[] = [];

    for (let i = 0; i < this.hashCount; i++) {
      const index = Math.abs(h1 + i * h2) % this.size;
      indices.push(index);
    }
    return indices;
  }

  private fnv1a(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
  }

  private djb2(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  /**
   * Debug helper to see the counters
   */
  getStats(): { filledSlots: number; maxCounter: number } {
    let filledSlots = 0;
    let max = 0;
    this.counterArray.forEach(c => {
      if (c > 0) filledSlots++;
      if (c > max) max = c;
    });
    return { filledSlots, maxCounter: max };
  }
}
