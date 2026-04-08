import { BPlusTreeNode } from "./b+tree-node";

export class BPlusTree {
  root: BPlusTreeNode;
  t: number;

  /**
   * @param t Minimum degree (min keys = t-1, max keys = 2t-1)
   * @param isLeaf Whether the root starts as a leaf (Default: true)
   */
  constructor(t: number, isLeaf: boolean = true) {
    this.root = new BPlusTreeNode(t, isLeaf);
    this.t = t;
  }

  /**
   * Search for a key in the B+ Tree.
   * @param key The key to search for.
   * @returns True if found, false otherwise.
   */
  search(key: number): boolean {
    return this.searchEntry(this.root, key);
  }

  private searchEntry(node: BPlusTreeNode, key: number): boolean {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    if (node.isLeaf) {
      return i < node.keys.length && node.keys[i] === key;
    }

    // Index node: our convention is keys[i] = min of children[i+1]
    // So if key >= node.keys[i], it's in children[i+1] or further
    if (i < node.keys.length && key === node.keys[i]) {
      return this.searchEntry(node.children[i + 1], key);
    } else {
      return this.searchEntry(node.children[i], key);
    }
  }

  /**
   * Insert a key into the B+ Tree.
   */
  insert(key: number): void {
    if (this.root.keys.length === 2 * this.t - 1) {
      const newRoot = new BPlusTreeNode(this.t, false);
      newRoot.children.push(this.root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }
    this.insertNonFull(this.root, key);
  }

  private insertNonFull(node: BPlusTreeNode, key: number): void {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      while (i >= 0 && node.keys[i] > key) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      // If we don't want duplicates:
      // if (i >= 0 && node.keys[i] === key) return;
      node.keys[i + 1] = key;
    } else {
      while (i >= 0 && node.keys[i] > key) {
        i--;
      }
      i++;

      if (node.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(node, i);
        // If key matches the new separator, it should go to the right child (consistent with search)
        if (key >= node.keys[i]) {
          i++;
        }
      }
      this.insertNonFull(node.children[i], key);
    }
  }

  private splitChild(parent: BPlusTreeNode, i: number): void {
    const child = parent.children[i];
    const newChild = new BPlusTreeNode(this.t, child.isLeaf);

    if (child.isLeaf) {
      const mid = this.t - 1;
      newChild.keys = child.keys.splice(mid);
      
      parent.keys.splice(i, 0, newChild.keys[0]);
      parent.children.splice(i + 1, 0, newChild);

      newChild.next = child.next;
      child.next = newChild;
    } else {
      // In internal node split, the middle key MOVES UP to parent
      const midKey = child.keys[this.t - 1];
      newChild.keys = child.keys.splice(this.t);
      newChild.children = child.children.splice(this.t);
      
      child.keys.pop(); // Remove midKey from child
      
      parent.keys.splice(i, 0, midKey);
      parent.children.splice(i + 1, 0, newChild);
    }
  }

  /**
   * Delete a key from the B+ Tree.
   */
  delete(key: number): void {
    if (this.root.keys.length === 0) return;
    this.deleteEntry(this.root, key);

    if (this.root.keys.length === 0 && !this.root.isLeaf) {
      this.root = this.root.children[0];
    }
  }

  private deleteEntry(node: BPlusTreeNode, key: number): void {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    if (node.isLeaf) {
      if (i < node.keys.length && node.keys[i] === key) {
        node.keys.splice(i, 1);
      }
      return;
    }

    // Index node: decide which child to go
    let childIdx = i;
    if (i < node.keys.length && key === node.keys[i]) {
      childIdx = i + 1;
    }

    const child = node.children[childIdx];
    if (child.keys.length < this.t) {
      this.fillChild(node, childIdx);
      
      // After fill, recalculate target child index
      i = 0;
      while (i < node.keys.length && key > node.keys[i]) {
        i++;
      }
      childIdx = i;
      if (i < node.keys.length && key === node.keys[i]) {
        childIdx = i + 1;
      }
    }

    this.deleteEntry(node.children[childIdx], key);

    // Maintenance: update separator keys in the current node path
    if (!node.isLeaf) {
      for (let j = 0; j < node.keys.length; j++) {
        node.keys[j] = this.getMin(node.children[j + 1]);
      }
    }
  }

  private fillChild(node: BPlusTreeNode, i: number): void {
    if (i !== 0 && node.children[i - 1].keys.length >= this.t) {
      this.borrowFromPrev(node, i);
    } else if (i !== node.children.length - 1 && node.children[i + 1].keys.length >= this.t) {
      this.borrowFromNext(node, i);
    } else {
      if (i !== node.children.length - 1) {
        this.merge(node, i);
      } else {
        this.merge(node, i - 1);
      }
    }
  }

  private borrowFromPrev(node: BPlusTreeNode, i: number): void {
    const child = node.children[i];
    const prev = node.children[i - 1];

    if (child.isLeaf) {
      child.keys.unshift(prev.keys.pop()!);
    } else {
      child.keys.unshift(node.keys[i - 1]);
      node.keys[i - 1] = prev.keys.pop()!;
      child.children.unshift(prev.children.pop()!);
    }
  }

  private borrowFromNext(node: BPlusTreeNode, i: number): void {
    const child = node.children[i];
    const next = node.children[i + 1];

    if (child.isLeaf) {
      child.keys.push(next.keys.shift()!);
    } else {
      child.keys.push(node.keys[i]);
      node.keys[i] = next.keys.shift()!;
      child.children.push(next.children.shift()!);
    }
  }

  private merge(node: BPlusTreeNode, i: number): void {
    const left = node.children[i];
    const right = node.children[i + 1];

    if (left.isLeaf) {
      left.keys.push(...right.keys);
      left.next = right.next;
    } else {
      left.keys.push(node.keys[i]);
      left.keys.push(...right.keys);
      left.children.push(...right.children);
    }
    
    node.keys.splice(i, 1);
    node.children.splice(i + 1, 1);
  }

  private getMin(node: BPlusTreeNode): number {
    let curr = node;
    while (!curr.isLeaf) {
      curr = curr.children[0];
    }
    return curr.keys[0];
  }

  /**
   * Hierarchical tree visualization.
   */
  dump(): void {
    console.log("--- B+ Tree Hierarchy Dump ---");
    const queue: {node: BPlusTreeNode, level: number}[] = [{node: this.root, level: 0}];
    let currentLevel = -1;
    let line = "";

    while (queue.length > 0) {
      const {node, level} = queue.shift()!;
      if (level !== currentLevel) {
        if (line) console.log(line);
        currentLevel = level;
        line = `[Level ${level}] `;
      }
      const type = node.isLeaf ? "L" : "I";
      line += `${type}:[${node.keys.join(",")}]  `;
      if (!node.isLeaf) {
        node.children.forEach(c => queue.push({node: c, level: level + 1}));
      }
    }
    console.log(line);
    console.log("------------------------------");
  }

  /**
   * Leaf node traversal.
   */
  print(): void {
    let curr: BPlusTreeNode | null = this.root;
    while (curr && !curr.isLeaf) curr = curr.children[0];
    let res = "";
    while (curr) {
      res += `(${curr.keys.join(",")}) -> `;
      curr = curr.next;
    }
    console.log("Leaves: " + res + "null");
  }
}
