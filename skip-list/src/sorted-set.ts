import { SkipList } from "./skip-list";

/**
 * Redis-like Sorted Set Implementation
 * 
 * Uses a combination of:
 * 1. Map (Hash Table) for O(1) score lookup by member.
 * 2. Skip List for O(log N) range queries and ordered traversal.
 */
export class SortedSet {
  private dict: Map<string, number>; // member -> score
  private skipList: SkipList<string>; // score -> member

  constructor() {
    this.dict = new Map();
    this.skipList = new SkipList(16, 0.5);
  }

  /**
   * ZADD: Adds a member with a score. 
   * Updates score if member already exists.
   */
  zadd(member: string, score: number): void {
    const oldScore = this.dict.get(member);

    if (oldScore !== undefined) {
      if (oldScore === score) return; // No change
      // In a real Redis, we'd need to delete the old score entry from SkipList
      this.skipList.delete(oldScore);
    }

    this.dict.set(member, score);
    this.skipList.insert(score, member);
  }

  /**
   * ZSCORE: Get the score of a member in O(1).
   */
  zscore(member: string): number | undefined {
    return this.dict.get(member);
  }

  /**
   * ZREM: Remove a member.
   */
  zrem(member: string): boolean {
    const score = this.dict.get(member);
    if (score === undefined) return false;

    this.skipList.delete(score);
    this.dict.delete(member);
    return true;
  }

  /**
   * ZRANGE: Simple range query (simulated by dumping the sorted list)
   */
  zrange(): string[] {
    // In our simplified SkipList, we can traverse Level 0
    // This is a peek at the sorted order
    const result: string[] = [];
    // We'd need an iterator for the SkipList to do this properly
    // For now, let's use a debug dump approach
    console.log("Current Sorted Sequence (Score: Member):");
    this.printSorted();
    return result;
  }

  private printSorted(): void {
    // Accessing private head for demo purposes
    let curr: any = (this.skipList as any).head.next[0];
    while (curr !== null) {
      console.log(`  ${curr.key}: ${curr.value}`);
      curr = curr.next[0];
    }
  }
}
