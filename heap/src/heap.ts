/**
 * 제네릭 Heap (Priority Queue) 구현
 * 기본적으로 Min-Heap으로 동작하며, comparator를 주입하여 Max-Heap으로도 사용 가능합니다.
 */
export class Heap<T> {
  private data: T[];
  private compare: (a: T, b: T) => number;

  /**
   * @param compare a가 부모, b가 자식일 때 음수면 우선순위가 높다고 판단합니다.
   * 기본값은 Min-Heap: (a, b) => a - b (숫자 기준)
   */
  constructor(compare: (a: T, b: T) => number = (a: any, b: any) => a - b) {
    this.data = [];
    this.compare = compare;
  }

  /**
   * 배열을 O(N) 시간 복잡도로 힙 구조로 변환합니다. (Floyd's algorithm)
   */
  public static heapify<U>(
    elements: U[],
    compare: (a: U, b: U) => number = (a: any, b: any) => a - b
  ): Heap<U> {
    const heap = new Heap<U>(compare);
    heap.data = [...elements];
    // 마지막 내부 노드(internal node)부터 역순으로 bubbleDown을 수행
    const firstInternalNodeIndex = Math.floor((heap.data.length - 2) / 2);
    for (let i = firstInternalNodeIndex; i >= 0; i--) {
      heap.bubbleDown(i);
    }
    return heap;
  }

  public get size(): number {
    return this.data.length;
  }

  public get isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * 루트 요소를 확인합니다. O(1)
   */
  public peek(): T | undefined {
    return this.data[0];
  }

  /**
   * 요소를 힙에 삽입합니다. O(log N)
   */
  public push(value: T): void {
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  /**
   * 우선순위가 가장 높은 요소(루트)를 추출하고 반환합니다. O(log N)
   */
  public pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    if (this.data.length === 1) return this.data.pop();

    const root = this.data[0];
    const last = this.data.pop()!;
    this.data[0] = last;
    this.bubbleDown(0);

    return root;
  }

  private bubbleUp(index: number): void {
    const value = this.data[index]!;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parentValue = this.data[parentIndex]!;

      // 부모의 우선순위가 더 높거나 같으면(compare <= 0) 중단
      if (this.compare(parentValue, value) <= 0) break;

      // 부모가 우선순위가 낮다면 스왑
      this.data[index] = parentValue;
      index = parentIndex;
    }
    this.data[index] = value;
  }

  private bubbleDown(index: number): void {
    const value = this.data[index]!;
    const length = this.data.length;

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let targetIndex = index;
      let targetValue = value;

      // 왼쪽 자식과 비교
      if (
        leftChildIndex < length &&
        this.compare(this.data[leftChildIndex]!, targetValue) < 0
      ) {
        targetIndex = leftChildIndex;
        targetValue = this.data[leftChildIndex]!;
      }

      // 오른쪽 자식과 비교 (현재까지의 타겟과 오른쪽 자식을 비교)
      if (
        rightChildIndex < length &&
        this.compare(this.data[rightChildIndex]!, targetValue) < 0
      ) {
        targetIndex = rightChildIndex;
        targetValue = this.data[rightChildIndex]!;
      }

      // 더 이상 내려갈 필요가 없으면 중단
      if (targetIndex === index) break;

      // 스왑 후 계속 내려감
      this.data[index] = this.data[targetIndex]!;
      index = targetIndex;
    }
    this.data[index] = value;
  }
}
