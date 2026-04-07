import { BTreeNode } from "./b-tree-node";

export class BTree {
  root: BTreeNode;
  t: number;

  constructor(t: number, isLeaf: boolean = true) {
    this.root = new BTreeNode(t, isLeaf);
    this.t = t;
  }

  /**
   * Insert a key into the tree.
   * @param key The key to insert.
   */
  insert(key: number): void {
    if (this.root.keys.length === 2 * this.t - 1) {
      const newRoot = new BTreeNode(this.t, false);
      newRoot.children.push(this.root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this.insertNonFull(this.root, key);
  }

  /**
   * Search for a key in the tree.
   * @param key The key to search for.
   * @returns True if the key is found, false otherwise.
   */
  search(key: number): boolean {
    return this.searchEntry(this.root, key);
  }

  /**
   * Delete a key from the tree.
   * @param key The key to delete.
   */
  delete(key: number): void {
    if (this.root.keys.length === 0) {
      console.log("The tree is empty");
      return;
    }

    this.deleteEntry(this.root, key);

    // If the root has no keys, make its only child the new root.
    // This happens when the root has two children and both are merged.
    if (this.root.keys.length === 0) {
      if (this.root.isLeaf) {
        this.root = new BTreeNode(this.t, true); // Tree is empty
      } else {
        this.root = this.root.children[0]; // Root has only one child
      }
    }
  }

  /**
   * Split the child of a node.
   * @param parent The parent node.
   * @param i The index of the child to split.
   */
  private splitChild(parent: BTreeNode, i: number): void {
    const child = parent.children[i];
    const newChild = new BTreeNode(this.t, child.isLeaf);

    // 1. Slide parent's key to new child node.
    parent.children.splice(i + 1, 0, newChild);

    // 2. Slide parent's key and insert the medium of child.
    parent.keys.splice(i, 0, child.keys[this.t - 1]);

    // 3. Move the largest t-1 keys of child to new child.
    newChild.keys = child.keys.splice(this.t);
    child.keys.length = this.t - 1;

    // 4. If the child is not a leaf, move the largest t children of child to new child.
    if (!child.isLeaf) {
      newChild.children = child.children.splice(this.t);
      child.children.length = this.t;
    }
  }

  /**
   * Insert a key into a node that is not full.
   * @param node The node to insert the key into.
   * @param key The key to insert.
   */
  private insertNonFull(node: BTreeNode, key: number): void {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      while (i >= 0 && node.keys[i] > key) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;
    } else {
      while (i >= 0 && node.keys[i] > key) {
        i--;
      }
      i++;

      if (node.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(node, i);
        if (node.keys[i] < key) {
          i++;
        }
      }

      this.insertNonFull(node.children[i], key);
    }
  }

  /**
   * Search for a key in a node.
   * @param node The node to search in.
   * @param key The key to search for.
   * @returns True if the key is found, false otherwise.
   */
  private searchEntry(node: BTreeNode, key: number): boolean {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    if (i < node.keys.length && key === node.keys[i]) {
      return true;
    }

    if (node.isLeaf) {
      return false;
    }

    return this.searchEntry(node.children[i], key);
  }

  /**
   * Delete a key from a node.
   * @param node The node to delete the key from.
   * @param key The key to delete.
   */
  private deleteEntry(node: BTreeNode, key: number): void {
    let i = 0;

    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    // Case: The key is found in the current node.
    if (i < node.keys.length && key === node.keys[i]) {
      // Case 1: The key is in a leaf node.
      if (node.isLeaf) {
        node.keys.splice(i, 1);
        return;
      }
      // Case 2: The key is in an internal node.
      this.deleteFromInternalNode(node, i);

    } else {
      // Case 3: The key is not in the current node.
      if (node.isLeaf) {
        console.log("Key not found");
        return;
      }

      this.deleteFromChild(node, i, key);
    }
  }

  /**
   * Delete a key from an internal node.
   * @param node The parent node.
   * @param i The index of the key to delete.
   */
  private deleteFromInternalNode(node: BTreeNode, i: number): void {
    const key = node.keys[i];
    const leftChild = node.children[i];
    const rightChild = node.children[i + 1];

    // Case 2-1: The left child has at least t keys.
    if (leftChild.keys.length >= this.t) {
      const predecessor = this.getPredecessor(leftChild);
      node.keys[i] = predecessor;
      this.deleteEntry(leftChild, predecessor);
    }
    // Case 2-2: The right child has at least t keys.
    else if (rightChild.keys.length >= this.t) {
      const successor = this.getSuccessor(rightChild);
      node.keys[i] = successor;
      this.deleteEntry(rightChild, successor);
    } 
    // Case 2-3: Both children have t-1 keys.
    else {
      this.mergeChildren(node, i);
      this.deleteEntry(node.children[i], key);
    }
  }

  /**
   * Delete a key from a child node.
   * @param node The parent node.
   * @param i The index of the child to delete the key from.
   * @param key The key to delete.
   */
  private deleteFromChild(node: BTreeNode, i: number, key: number): void {
    let flag = i === node.keys.length;

    if (node.children[i].keys.length < this.t) {
      this.fillChild(node, i);
    }

    if (flag && i > node.keys.length) {
      this.deleteEntry(node.children[i - 1], key);
    } else {
      this.deleteEntry(node.children[i], key);
    }
  }

  /**
   * Get the predecessor of a node.
   * @param node The node to get the predecessor of.
   * @returns The predecessor of the node.
   */
  private getPredecessor(node: BTreeNode): number {
    while (!node.isLeaf) {
      node = node.children[node.children.length - 1];
    }

    return node.keys[node.keys.length - 1]; // Return the largest key in the left subtree.
  }

  /**
   * Get the successor of a node.
   * @param node The node to get the successor of.
   * @returns The successor of the node.
   */
  private getSuccessor(node: BTreeNode): number {
    while (!node.isLeaf) {
      node = node.children[0];
    }

    return node.keys[0]; // Return the smallest key in the right subtree.
  }

  /**
   * Fill a child node.
   * @param node The parent node.
   * @param i The index of the child to fill.
   */
  private fillChild(node: BTreeNode, i: number): void {
    // Case 1: The previous child has at least t keys.
    if (i !== 0 && node.children[i - 1].keys.length >= this.t) {
      this.borrowFromPrevious(node, i);
    // Case 2: The next child has at least t keys.
    } else if (i !== node.children.length - 1 && node.children[i + 1].keys.length >= this.t) {
      this.borrowFromNext(node, i);
    // Case 3: Both children have t-1 keys.
    } else {
      if (i !== node.children.length - 1) {
        this.mergeChildren(node, i);
      } else {
        this.mergeChildren(node, i - 1);
      }
    }
  }

  /**
   * Borrow a key from the previous child.
   * @param node The parent node.
   * @param i The index of the child to borrow from.
   */
  private borrowFromPrevious(node: BTreeNode, i: number): void {
    const child = node.children[i];
    const prevChild = node.children[i - 1];

    // 1. Move the key from the parent to the child.
    child.keys.unshift(node.keys[i - 1]);

    // 2. Move the largest key from the previous child to the parent.
    node.keys[i - 1] = prevChild.keys.pop()!;

    // 3. Move the largest child of the previous child to the child.
    if (!child.isLeaf) {
      child.children.unshift(prevChild.children.pop()!);
    }
  }

  /**
   * Borrow a key from the next child.
   * @param node The parent node.
   * @param i The index of the child to borrow from.
   */
  private borrowFromNext(node: BTreeNode, i: number): void {
    const child = node.children[i];
    const nextChild = node.children[i + 1];

    // 1. Move the key from the parent to the child.
    child.keys.push(node.keys[i]);

    // 2. Move the smallest key from the next child to the parent.
    node.keys[i] = nextChild.keys.shift()!;

    // 3. Move the smallest child of the next child to the child.
    if (!child.isLeaf) {
      child.children.push(nextChild.children.shift()!);
    }
  }

  /**
   * Merge two children of a node.
   * @param node The parent node.
   * @param i The index of the child to merge.
   */
  private mergeChildren(node: BTreeNode, i: number): void {
    const child = node.children[i];
    const nextChild = node.children[i + 1];

    // 1. Move the key from the parent to the child.
    child.keys.push(node.keys.splice(i, 1)[0]);

    // 2. Move all keys from the next child to the child.
    child.keys.push(...nextChild.keys);

    // 3. Move all children of the next child to the child.
    if (!child.isLeaf) {
      child.children.push(...nextChild.children);
    }

    // 4. Remove the next child.
    node.children.splice(i + 1, 1);
  }
}
