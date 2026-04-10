/**
 * LSM Tree (Log-Structured Merge-Tree)
 * 
 * Concept:
 * 1. MemTable: In-memory buffer where all writes go. Keep it sorted.
 * 2. Immutable MemTable: Once MemTable is full, it becomes immutable and ready to flush.
 * 3. SSTable (Sorted String Table): On-disk immutable files. Sorted by key.
 * 4. Compaction: Merging SSTables to reclaim space and maintain read performance.
 */

interface Entry {
  key: string;
  value: string;
  timestamp: number;
  isDeleted: boolean; // Tombstone for deletions
}

class SSTable {
  constructor(public id: number, public data: Entry[]) {}

  /**
   * Search within this specific SSTable. 
   * Since data is sorted, we could use Binary Search.
   */
  get(key: string): Entry | undefined {
    let low = 0;
    let high = this.data.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.data[mid].key === key) return this.data[mid];
      if (this.data[mid].key < key) low = mid + 1;
      else high = mid - 1;
    }
    return undefined;
  }
}

export class LSMTree {
  private memTable: Map<string, Entry> = new Map();
  private ssTables: SSTable[] = []; // index 0 is newest
  private nextSSTableId = 0;
  
  constructor(
    private readonly memTableThreshold: number = 5,
    private readonly compactionThreshold: number = 3
  ) {}

  /** 
   * Insert or Update a key
   */
  set(key: string, value: string): void {
    const entry: Entry = {
      key,
      value,
      timestamp: Date.now(),
      isDeleted: false
    };
    this.memTable.set(key, entry);

    if (this.memTable.size >= this.memTableThreshold) {
      this.flush();
    }
  }

  /**
   * Delete a key (using Tombstone)
   */
  delete(key: string): void {
    const entry: Entry = {
      key,
      value: "",
      timestamp: Date.now(),
      isDeleted: true
    };
    this.memTable.set(key, entry);

    if (this.memTable.size >= this.memTableThreshold) {
      this.flush();
    }
  }

  /**
   * Search for a key. Check newest data first.
   * Path: MemTable -> Newest SSTable -> ... -> Oldest SSTable
   */
  get(key: string): string | null {
    // 1. Check MemTable
    const memEntry = this.memTable.get(key);
    if (memEntry) {
      return memEntry.isDeleted ? null : memEntry.value;
    }

    // 2. Check SSTables (Newest to Oldest)
    for (const sstable of this.ssTables) {
      const entry = sstable.get(key);
      if (entry) {
        return entry.isDeleted ? null : entry.value;
      }
    }

    return null;
  }

  /**
   * Flush MemTable to a new SSTable
   */
  private flush(): void {
    console.log(`[Flush] MemTable reached threshold. Flushing to SSTable ${this.nextSSTableId}...`);
    
    // Sort keys before creating SSTable
    const sortedEntries = Array.from(this.memTable.values())
      .sort((a, b) => a.key.localeCompare(b.key));

    const newSSTable = new SSTable(this.nextSSTableId++, sortedEntries);
    this.ssTables.unshift(newSSTable); // Add to front (newest)
    this.memTable.clear();

    if (this.ssTables.length >= this.compactionThreshold) {
      this.compact();
    }
  }

  /**
   * Compaction: Merge existing SSTables into one.
   * Logic: Combine sorted arrays, keep only the latest version of each key.
   */
  private compact(): void {
    console.log("[Compaction] Merging SSTables...");
    
    // In a real system, this would merge levels. 
    // Here we merge everything into a single consolidated SSTable for demo.
    const mergedMap = new Map<string, Entry>();

    // Process from oldest to newest so newest overwrites oldest in the map
    for (let i = this.ssTables.length - 1; i >= 0; i--) {
      for (const entry of this.ssTables[i].data) {
        mergedMap.set(entry.key, entry);
      }
    }

    const consolidatedData = Array.from(mergedMap.values())
      .filter(entry => !entry.isDeleted) // Remove tombstones during compaction
      .sort((a, b) => a.key.localeCompare(b.key));

    this.ssTables = [new SSTable(this.nextSSTableId++, consolidatedData)];
    console.log(`[Compaction Done] Resulting SSTable has ${consolidatedData.length} entries.`);
  }

  /**
   * For debugging
   */
  dump(): void {
    console.log("\n--- LSM Tree Snapshot ---");
    console.log(`MemTable (${this.memTable.size} entries):`, Array.from(this.memTable.keys()));
    console.log(`SSTables Count: ${this.ssTables.length}`);
    this.ssTables.forEach(ss => {
      console.log(`  SSTable ${ss.id} [${ss.data.length} entries]:`, ss.data.map(d => `${d.key}${d.isDeleted ? "(D)" : ""}`));
    });
    console.log("-------------------------\n");
  }
}
