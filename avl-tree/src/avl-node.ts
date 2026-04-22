export class AVLNode<K, V> {
  public key: K;
  public value: V;
  public height: number;
  public left: AVLNode<K, V> | null;
  public right: AVLNode<K, V> | null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.height = 1; // Leaf node height is 1
    this.left = null;
    this.right = null;
  }
}
