export class BTreeNode {
  t: number;
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;

  constructor(t: number, isLeaf: boolean) {
    this.t = t;
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}
