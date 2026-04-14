/**
 * Skip List Node
 */
class SkipNode<T> {
  key: number;
  value: T;
  next: (SkipNode<T> | null)[];

  constructor(key: number, value: T, level: number) {
    this.key = key;
    this.value = value;
    /**
     * next[i] points to the next node in level i
     */
    this.next = new Array(level).fill(null);
  }
}

export { SkipNode };