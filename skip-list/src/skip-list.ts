import { SkipNode } from "./skip-node";

/**
 * Skip List Implementation
 * 
 * Average Time Complexity: O(log N) for search, insert, and delete.
 */
export class SkipList<T> {
  private maxLevel: number;
  private p: number; // Probability factor (usually 0.5)
  private head: SkipNode<T | null>;
  private level: number; // Current maximum level of the entire list

  constructor(maxLevel: number = 16, p: number = 0.5) {
    this.maxLevel = maxLevel;
    this.p = p;
    this.level = 0;
    // Sentinel head node with the maximum possible level
    this.head = new SkipNode(-Infinity, null, maxLevel);
  }

  /**
   * Randomly determines the level of a new node.
   * Coin flip logic.
   */
  private randomLevel(): number {
    let lvl = 1;
    while (Math.random() < this.p && lvl < this.maxLevel) {
      lvl++;
    }
    return lvl;
  }

  /**
   * Insert/Update a key-value pair.
   */
  insert(key: number, value: T): void {
    const update = new Array<SkipNode<T | null>>(this.maxLevel);
    let curr = this.head;

    // 1. Traverse from top level to find the update points
    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.next[i] !== null && curr.next[i]!.key < key) {
        curr = curr.next[i]!;
      }
      update[i] = curr;
    }

    // Move to the actual position at level 0
    let nextNode = curr.next[0];

    // 2. If key exists, update value
    if (nextNode !== null && nextNode.key === key) {
      nextNode.value = value;
      return;
    }

    // 3. If key doesn't exist, create new node
    const newLevel = this.randomLevel();
    if (newLevel > this.level) {
      for (let i = this.level; i < newLevel; i++) {
        update[i] = this.head;
      }
      this.level = newLevel;
    }

    const newNode = new SkipNode(key, value, newLevel);
    for (let i = 0; i < newLevel; i++) {
      newNode.next[i] = update[i].next[i] as any;
      update[i].next[i] = newNode as any;
    }
  }

  /**
   * Search for a key.
   */
  search(key: number): T | null {
    let curr = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.next[i] !== null && curr.next[i]!.key < key) {
        curr = curr.next[i]!;
      }
    }
    curr = curr.next[0] as any;
    if (curr !== null && curr.key === key) {
      return curr.value;
    }
    return null;
  }

  /**
   * Delete a key.
   */
  delete(key: number): boolean {
    const update = new Array<SkipNode<T | null>>(this.maxLevel);
    let curr = this.head;

    for (let i = this.level - 1; i >= 0; i--) {
      while (curr.next[i] !== null && curr.next[i]!.key < key) {
        curr = curr.next[i]!;
      }
      update[i] = curr;
    }

    let target = curr.next[0] as any;

    if (target !== null && target.key === key) {
      // Unlink the node from all levels it exists in
      for (let i = 0; i < this.level; i++) {
        if (update[i].next[i] !== target) break;
        update[i].next[i] = target.next[i];
      }

      // Update current max level if necessary
      while (this.level > 1 && this.head.next[this.level - 1] === null) {
        this.level--;
      }
      return true;
    }
    return false;
  }

  /**
   * Multi-level visualization
   */
  dump(): void {
    console.log("--- Skip List Multi-level Dump ---");
    for (let i = this.level - 1; i >= 0; i--) {
      let line = `Level ${i}: `;
      let curr = this.head.next[i];
      while (curr !== null) {
        line += `${curr.key} -> `;
        curr = curr.next[i];
      }
      console.log(line + "null");
    }
    console.log("----------------------------------\n");
  }
}
