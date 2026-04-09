/**
 * HashTable Implementation
 * 
 * A Hash Table is a data structure that stores values associated with keys.
 * It uses a hash function to compute an index into an array of buckets or slots,
 * from which the desired value can be found.
 * 
 * Average Time Complexity: O(1) for search, insert, and delete.
 */
export class HashTable {
  // Buckets to store data pairs [key, value]
  // Uses Chaining method: colliding keys are stored in an array at the same index.
  private table: Array<Array<[string, any]>>;
  
  // Current size of the table (number of buckets)
  private size: number;
  
  // Number of items currently stored
  private count: number;
  
  // Threshold to determine when to expand the table (0.75 = 75%)
  private readonly LOAD_FACTOR_THRESHOLD = 0.75;

  constructor(size: number = 10) {
    this.size = size;
    this.count = 0;
    this.table = new Array(size);
  }

  /**
   * Hash Function
   * Converts a string key into a numeric index.
   * Uses a polynomial rolling hash with a prime multiplier to minimize collisions.
   */
  private hash(key: string): number {
    let hash = 0;
    const prime = 31; // Prime number to improve hash distribution
    for (let i = 0; i < key.length; i++) {
      hash = (hash * prime + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  /**
   * Set Data
   * Updates the value if the key exists, otherwise adds a new pair.
   */
  set(key: string, value: any): void {
    // Check Load Factor and resize if necessary
    if (this.count / this.size >= this.LOAD_FACTOR_THRESHOLD) {
      this.resize(this.size * 2);
    }

    const index = this.hash(key);
    
    if (!this.table[index]) {
      this.table[index] = [];
    }

    // Replace value if key already exists
    const bucket = this.table[index];
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }

    // Add new pair for new key
    bucket.push([key, value]);
    this.count++;
  }

  /**
   * Get Data
   * Returns the value associated with the key, or undefined if not found.
   */
  get(key: string): any {
    const index = this.hash(key);
    const bucket = this.table[index];

    if (!bucket) return undefined;

    for (const [k, v] of bucket) {
      if (k === key) return v;
    }
    return undefined;
  }

  /**
   * Delete Data
   * Removes the key-value pair and returns true if successful.
   */
  delete(key: string): boolean {
    const index = this.hash(key);
    const bucket = this.table[index];

    if (!bucket) return false;

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.count--;
        return true;
      }
    }
    return false;
  }

  /**
   * Resize Table
   * Changes the table size and rehashes all existing items.
   */
  private resize(newSize: number): void {
    const oldTable = this.table;
    this.size = newSize;
    this.count = 0;
    this.table = new Array(newSize);

    for (const bucket of oldTable) {
      if (bucket) {
        for (const [key, value] of bucket) {
          // Re-insert into the new table
          this.set(key, value);
        }
      }
    }
  }

  /**
   * Helper method to check current table metrics
   */
  public getStats(): object {
    return {
      size: this.size,
      count: this.count,
      loadFactor: (this.count / this.size).toFixed(2)
    };
  }
}
