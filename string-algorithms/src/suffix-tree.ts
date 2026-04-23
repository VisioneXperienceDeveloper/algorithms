import { SuffixArray } from "./suffix-array";

/**
 * Suffix Tree Node
 */
class SuffixTreeNode {
  public children: Map<string, SuffixTreeNode> = new Map();
  public start: number;
  public end: number;
  public suffixIndex: number;

  constructor(start: number, end: number, suffixIndex: number = -1) {
    this.start = start;
    this.end = end;
    this.suffixIndex = suffixIndex;
  }
}

/**
 * Suffix Tree (Simplified construction from Suffix Array)
 * Note: A full Suffix Tree from scratch is O(N). 
 * Here we demonstrate the concept by building a compressed structure.
 */
export class SuffixTree {
  public readonly root: SuffixTreeNode;
  private readonly text: string;

  constructor(text: string) {
    this.text = text;
    this.root = new SuffixTreeNode(-1, -1);
    this.buildFromSA(new SuffixArray(text));
  }

  /**
   * Build a compressed trie structure to represent the Suffix Tree
   */
  private buildFromSA(saObj: SuffixArray): void {
    const { sa, lcp } = saObj;
    const n = sa.length;

    for (let i = 0; i < n; i++) {
        const suffix = this.text.substring(sa[i]);
        this.insertSuffix(suffix, sa[i]);
    }
  }

  private insertSuffix(suffix: string, originalIndex: number): void {
    let curr = this.root;
    let i = 0;

    while (i < suffix.length) {
      let char = suffix[i];
      let child = curr.children.get(char);

      if (!child) {
        // Create a new leaf node
        curr.children.set(char, new SuffixTreeNode(originalIndex + i, this.text.length, originalIndex));
        return;
      }

      // Find the edge match length
      let j = child.start;
      let matchLen = 0;
      while (j < child.end && i < suffix.length && this.text[j] === suffix[i]) {
        i++;
        j++;
        matchLen++;
      }

      if (j === child.end) {
        // Full edge match, move down
        curr = child;
      } else {
        // Partial match, split the edge
        const splitNode = new SuffixTreeNode(child.start, j);
        curr.children.set(this.text[child.start], splitNode);
        
        child.start = j;
        splitNode.children.set(this.text[j], child);
        
        if (i < suffix.length) {
          splitNode.children.set(suffix[i], new SuffixTreeNode(originalIndex + i, this.text.length, originalIndex));
        } else {
          splitNode.suffixIndex = originalIndex;
        }
        return;
      }
    }
  }

  public dump(): void {
    console.log("\n--- Suffix Tree Structure ---");
    this.printTree(this.root, 0);
  }

  private printTree(node: SuffixTreeNode, depth: number): void {
    const indent = "  ".repeat(depth);
    for (const [char, child] of node.children) {
      const edgeLabel = this.text.substring(child.start, child.end);
      console.log(`${indent}${edgeLabel} (idx: ${child.suffixIndex})`);
      this.printTree(child, depth + 1);
    }
  }
}
