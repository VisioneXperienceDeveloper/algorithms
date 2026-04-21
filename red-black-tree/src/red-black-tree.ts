import { Color, RedBlackNode } from "./red-black-node";

export class RedBlackTree<K, V> {
  private nil: RedBlackNode<K, V>;
  private root: RedBlackNode<K, V>;

  constructor() {
    // 1. Initialize NIL sentinel (Must be BLACK)
    this.nil = new RedBlackNode<K, V>(null as any, null as any, Color.BLACK);
    this.nil.left = this.nil;
    this.nil.right = this.nil;
    this.nil.parent = this.nil;
    
    // 2. Initial root is NIL
    this.root = this.nil;
  }

  /**
   * Standard Search
   */
  search(key: K): V | null {
    let curr = this.root;
    while (curr !== this.nil) {
      if (key === curr.key) return curr.value;
      if (key < curr.key) curr = curr.left;
      else curr = curr.right;
    }
    return null;
  }

  /**
   * Left Rotation
   *    x            y
   *   / \   ->     / \
   *  a   y        x   c
   *     / \      / \
   *    b   c    a   b
   */
  private rotateLeft(x: RedBlackNode<K, V>): void {
    const y = x.right;
    x.right = y.left;

    if (y.left !== this.nil) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  /**
   * Right Rotation
   */
  private rotateRight(y: RedBlackNode<K, V>): void {
    const x = y.left;
    y.left = x.right;

    if (x.right !== this.nil) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (y.parent === this.nil) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }

    x.right = y;
    y.parent = x;
  }

  /**
   * Insertion
   */
  insert(key: K, value: V): void {
    let y = this.nil;
    let x = this.root;

    // Standard BST Insert
    const newNode = new RedBlackNode(key, value, Color.RED, this.nil);

    while (x !== this.nil) {
      y = x;
      if (newNode.key === x.key) {
        x.value = value; // Update value if key exists
        return;
      }
      if (newNode.key < x.key) x = x.left;
      else x = x.right;
    }

    newNode.parent = y;
    if (y === this.nil) {
      this.root = newNode;
    } else if (newNode.key < y.key) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    // Fix RB Properties
    this.insertFixup(newNode);
  }

  private insertFixup(z: RedBlackNode<K, V>): void {
    while (z.parent.color === Color.RED) {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right; // Uncle

        if (y.color === Color.RED) {
          // Case 1: Uncle is Red
          z.parent.color = Color.BLACK;
          y.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            // Case 2: Uncle is Black, z is right child (Triangle)
            z = z.parent;
            this.rotateLeft(z);
          }
          // Case 3: Uncle is Black, z is left child (Line)
          z.parent.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.rotateRight(z.parent.parent);
        }
      } else {
        // Mirror cases (z.parent is right child)
        const y = z.parent.parent.left;
        if (y.color === Color.RED) {
          z.parent.color = Color.BLACK;
          y.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rotateRight(z);
          }
          z.parent.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.rotateLeft(z.parent.parent);
        }
      }
    }
    this.root.color = Color.BLACK;
  }

  /**
   * Deletion
   */
  delete(key: K): boolean {
    let z = this.root;
    while (z !== this.nil) {
      if (key === z.key) break;
      if (key < z.key) z = z.left;
      else z = z.right;
    }

    if (z === this.nil) return false;

    let y = z;
    let yOriginalColor = y.color;
    let x: RedBlackNode<K, V>;

    if (z.left === this.nil) {
      x = z.right;
      this.rbTransplant(z, z.right);
    } else if (z.right === this.nil) {
      x = z.left;
      this.rbTransplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        x.parent = y;
      } else {
        this.rbTransplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.rbTransplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    if (yOriginalColor === Color.BLACK) {
      this.deleteFixup(x);
    }
    return true;
  }

  private deleteFixup(x: RedBlackNode<K, V>): void {
    while (x !== this.root && x.color === Color.BLACK) {
      if (x === x.parent.left) {
        let w = x.parent.right; // Sibling
        if (w.color === Color.RED) {
          // Case 1
          w.color = Color.BLACK;
          x.parent.color = Color.RED;
          this.rotateLeft(x.parent);
          w = x.parent.right;
        }
        if (w.left.color === Color.BLACK && w.right.color === Color.BLACK) {
          // Case 2
          w.color = Color.RED;
          x = x.parent;
        } else {
          if (w.right.color === Color.BLACK) {
            // Case 3
            w.left.color = Color.BLACK;
            w.color = Color.RED;
            this.rotateRight(w);
            w = x.parent.right;
          }
          // Case 4
          w.color = x.parent.color;
          x.parent.color = Color.BLACK;
          w.right.color = Color.BLACK;
          this.rotateLeft(x.parent);
          x = this.root;
        }
      } else {
        // Mirror symmetric for right child
        let w = x.parent.left;
        if (w.color === Color.RED) {
          w.color = Color.BLACK;
          x.parent.color = Color.RED;
          this.rotateRight(x.parent);
          w = x.parent.left;
        }
        if (w.right.color === Color.BLACK && w.left.color === Color.BLACK) {
          w.color = Color.RED;
          x = x.parent;
        } else {
          if (w.left.color === Color.BLACK) {
            w.right.color = Color.BLACK;
            w.color = Color.RED;
            this.rotateLeft(w);
            w = x.parent.left;
          }
          w.color = x.parent.color;
          x.parent.color = Color.BLACK;
          w.left.color = Color.BLACK;
          this.rotateRight(x.parent);
          x = this.root;
        }
      }
    }
    x.color = Color.BLACK;
  }

  private rbTransplant(u: RedBlackNode<K, V>, v: RedBlackNode<K, V>): void {
    if (u.parent === this.nil) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  private minimum(node: RedBlackNode<K, V>): RedBlackNode<K, V> {
    while (node.left !== this.nil) {
      node = node.left;
    }
    return node;
  }

  /**
   * Integrity Check: Verifies all Red-Black Properties
   */
  verifyProperties(): boolean {
    if (this.root === this.nil) return true;

    // 1. Root is Black
    if (this.root.color !== Color.BLACK) {
      console.error("Property Violation: Root is not BLACK");
      return false;
    }

    // 2. No Red-Red consecutive
    if (!this.checkRedNodes(this.root)) return false;

    // 3. Black-height consistency
    const bh = this.getBlackHeight(this.root);
    if (bh === -1) return false;

    return true;
  }

  private checkRedNodes(node: RedBlackNode<K, V>): boolean {
    if (node === this.nil) return true;
    if (node.color === Color.RED) {
      if (node.left.color === Color.RED || node.right.color === Color.RED) {
        console.error(`Property Violation: Red node ${node.key} has red child`);
        return false;
      }
    }
    return this.checkRedNodes(node.left) && this.checkRedNodes(node.right);
  }

  private getBlackHeight(node: RedBlackNode<K, V>): number {
    if (node === this.nil) return 1;

    const leftHeight = this.getBlackHeight(node.left);
    const rightHeight = this.getBlackHeight(node.right);

    if (leftHeight === -1 || rightHeight === -1 || leftHeight !== rightHeight) {
      if (leftHeight !== rightHeight) {
        console.error(`Property Violation: Black height mismatch at node ${node.key}`);
      }
      return -1;
    }

    return leftHeight + (node.color === Color.BLACK ? 1 : 0);
  }

  /**
   * Visual Dump
   */
  dump(): void {
    console.log("--- Red-Black Tree Structure ---");
    this.printNode(this.root, "", true);
  }

  private printNode(node: RedBlackNode<K, V>, indent: string, last: boolean): void {
    if (node !== this.nil) {
      console.log(indent);
      if (last) {
        console.log("R----");
        indent += "     ";
      } else {
        console.log("L----");
        indent += "|    ";
      }
      const colorStr = node.color === Color.RED ? "\x1b[31mRED\x1b[0m" : "BLACK";
      console.log(`${node.key} (${colorStr})`);
      this.printNode(node.left, indent, false);
      this.printNode(node.right, indent, true);
    }
  }
}
