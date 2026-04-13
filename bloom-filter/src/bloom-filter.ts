/**
 * Bloom Filter Implementation
 * 
 * A space-efficient probabilistic data structure used to test 
 * whether an element is a member of a set.
 * 
 * $n$: Number of items to be inserted
 * $m$: Size of the bit array
 * $k$: Number of hash functions
 * 
 * False Positive Probability:
 * $p \approx (1 - e^{-kn/m})^k$
 * 
 * Optimal m:
 * $m = -\frac{n \ln p}{(\ln 2)^2}$
 * 
 * Optimal k:
 * $k = \frac{m}{n} \ln 2$

 * Example:
 * $n = 1000$
 * $p = 0.01$
 * $m = -\frac{1000 \ln 0.01}{(\ln 2)^2} \approx 95850$
 * $k = \frac{1000}{95850} \ln 2 \approx 7$
 * 
 */
export class BloomFilter {
  private bitArray: Uint8Array;
  private size: number;
  private hashCount: number;

  /**
   * @param size Size of the bit array (m)
   * @param hashCount Number of hash functions (k)
   */
  constructor(size: number = 100, hashCount: number = 3) {
    this.size = size;
    this.hashCount = hashCount;
    // We use Uint8Array to represent bits. 
    // In a real production system, use a true BitSet for efficiency.
    this.bitArray = new Uint8Array(size);
  }

  /**
   * Adds an item to the Bloom Filter.
   */
  add(item: string): void {
    const indices = this.getIndices(item);
    indices.forEach(index => {
      this.bitArray[index] = 1;
    });
  }

  /**
   * Checks if an item might be in the Bloom Filter.
   * @returns false if definitely not present, true if possibly present.
   */
  contains(item: string): boolean {
    const indices = this.getIndices(item);
    // If ANY of the bits at these indices is 0, the item is definitely NOT there.
    return indices.every(index => this.bitArray[index] === 1);
  }

  /**
   * Generates 'k' hash indices using double hashing technique:
   * hash(i, key) = (hash1(key) + i * hash2(key)) % size
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

  /**
   * FNV-1a Hash Function
   * 
   * Why we use bitwise operations?
   * - JS uses 64-bit floating point numbers for all numbers.
   * - Bitwise operations treat numbers as 32-bit integers.
   * - It makes hash values to be distributed more uniformly, reducing collisions.
   */
  private fnv1a(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0; // Make it unsigned(+) 32-bit integer
  }

  /**
   * DJB2 Hash Function
   */
  private djb2(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  /**
   * Utility to see the fill rate of the bit array
   */
  getFillRate(): string {
    const setBits = this.bitArray.reduce((acc, bit) => acc + bit, 0);
    return ((setBits / this.size) * 100).toFixed(2) + "%";
  }
}
