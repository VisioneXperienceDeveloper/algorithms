export enum Color {
  RED,
  BLACK,
}

export class RedBlackNode<K, V> {
  public key: K;
  public value: V;
  public color: Color;
  public left: RedBlackNode<K, V>;
  public right: RedBlackNode<K, V>;
  public parent: RedBlackNode<K, V>;

  constructor(
    key: K,
    value: V,
    color: Color = Color.RED,
    nil?: RedBlackNode<K, V>
  ) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.left = nil!;
    this.right = nil!;
    this.parent = nil!;
  }
}
