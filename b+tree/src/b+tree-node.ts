export class BPlusTreeNode {
  t: number;
  isLeaf: boolean;
  keys: number[];
  children: BPlusTreeNode[];
  next: BPlusTreeNode | null;
  

  constructor(t: number, isLeaf: boolean = false) {
    this.t = t;
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = [];
    this.next = null;
  }
}
