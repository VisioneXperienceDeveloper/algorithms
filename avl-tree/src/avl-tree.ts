import { AVLNode } from "./avl-node";

export class AVLTree<K, V> {
  private root: AVLNode<K, V> | null = null;

  /**
   * Helper: Get node height
   */
  private getHeight(node: AVLNode<K, V> | null): number {
    return node ? node.height : 0;
  }

  /**
   * Helper: Update node height
   */
  private updateHeight(node: AVLNode<K, V>): void {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  /**
   * Helper: Get balance factor
   */
  private getBalance(node: AVLNode<K, V> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  /**
   * Simple Search
   */
  public search(key: K): V | null {
    let curr = this.root;
    while (curr) {
      if (key === curr.key) return curr.value;
      if (key < curr.key) curr = curr.left;
      else curr = curr.right;
    }
    return null;
  }

  /**
   * Right Rotation (LL Case)
   */
  private rotateRight(y: AVLNode<K, V>): AVLNode<K, V> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  /**
   * Left Rotation (RR Case)
   */
  private rotateLeft(x: AVLNode<K, V>): AVLNode<K, V> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  /**
   * Insertion
   */
  public insert(key: K, value: V): void {
    this.root = this.insertRecursive(this.root, key, value);
  }

  private insertRecursive(node: AVLNode<K, V> | null, key: K, value: V): AVLNode<K, V> {
    // 1. Normal BST Insert
    if (!node) return new AVLNode(key, value);

    if (key < node.key) {
      node.left = this.insertRecursive(node.left, key, value);
    } else if (key > node.key) {
      node.right = this.insertRecursive(node.right, key, value);
    } else {
      node.value = value; // Update value if key exists
      return node;
    }

    // 2. Update Height
    this.updateHeight(node);

    // 3. Rebalance
    return this.rebalance(node);
  }

  /**
   * Deletion
   */
  public delete(key: K): void {
    this.root = this.deleteRecursive(this.root, key);
  }

  private deleteRecursive(node: AVLNode<K, V> | null, key: K): AVLNode<K, V> | null {
    if (!node) return null;

    if (key < node.key) {
      node.left = this.deleteRecursive(node.left, key);
    } else if (key > node.key) {
      node.right = this.deleteRecursive(node.right, key);
    } else {
      // Node to delete found
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        const temp = this.minValueNode(node.right);
        node.key = temp.key;
        node.value = temp.value;
        node.right = this.deleteRecursive(node.right, temp.key);
      }
    }

    if (!node) return null;

    this.updateHeight(node);
    return this.rebalance(node);
  }

  private rebalance(node: AVLNode<K, V>): AVLNode<K, V> {
    const balance = this.getBalance(node);

    // Left Heavy
    if (balance > 1) {
      if (this.getBalance(node.left) < 0) {
        // LR Case
        node.left = this.rotateLeft(node.left!);
      }
      return this.rotateRight(node);
    }

    // Right Heavy
    if (balance < -1) {
      if (this.getBalance(node.right) > 0) {
        // RL Case
        node.right = this.rotateRight(node.right!);
      }
      return this.rotateLeft(node);
    }

    return node;
  }

  private minValueNode(node: AVLNode<K, V>): AVLNode<K, V> {
    let curr = node;
    while (curr.left) curr = curr.left;
    return curr;
  }

  /**
   * Integrity Check: Verifies AVL balance condition
   */
  public verifyBalance(node: AVLNode<K, V> | null = this.root): boolean {
    if (!node) return true;

    const balance = this.getBalance(node);
    if (balance > 1 || balance < -1) {
      console.error(`Balance Factor Violation at node ${node.key}: BF=${balance}`);
      return false;
    }

    // Height integrity check
    const expectedHeight = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    if (node.height !== expectedHeight) {
      console.error(`Height Inconsistency at node ${node.key}: Actual=${node.height}, Expected=${expectedHeight}`);
      return false;
    }

    return this.verifyBalance(node.left) && this.verifyBalance(node.right);
  }

  /**
   * Metrics: Get Tree Depth
   */
  public getDepth(): number {
    return this.getHeight(this.root);
  }

  /**
   * Visual Dump
   */
  public dump(): void {
    console.log("--- AVL Tree Structure ---");
    this.printNode(this.root, "", true);
  }

  private printNode(node: AVLNode<K, V> | null, indent: string, last: boolean): void {
    if (node) {
      process.stdout.write(indent);
      if (last) {
        process.stdout.write("R----");
        indent += "     ";
      } else {
        process.stdout.write("L----");
        indent += "|    ";
      }
      console.log(`${node.key} (H:${node.height}, BF:${this.getBalance(node)})`);
      this.printNode(node.left, indent, false);
      this.printNode(node.right, indent, true);
    }
  }
}
