/**
 * 고정된 메모리 크기를 시뮬레이션하는 동적 배열(Dynamic Array) 구현체
 * JavaScript의 기본 Array를 밑바탕으로 쓰되, Object 형태인 {} 를 이용해 연속된 메모리 공간처럼 흉내냅니다.
 * (JS 배열의 push, pop, shift, splice 등 내장 메서드는 사용하지 않습니다)
 */
export class DynamicArray<T> {
  private data: Record<number, T>;
  private _capacity: number;
  private _length: number;

  constructor(initialCapacity: number = 4) {
    this.data = {};
    this._capacity = initialCapacity;
    this._length = 0;
  }

  public get length(): number {
    return this._length;
  }

  public get capacity(): number {
    return this._capacity;
  }

  /**
   * O(1) - 특정 인덱스의 요소 반환
   */
  public get(index: number): T | undefined {
    if (index < 0 || index >= this._length) {
      return undefined; // Out of bounds
    }
    return this.data[index];
  }

  /**
   * O(1) - 특정 인덱스에 요소 덮어쓰기
   */
  public set(index: number, value: T): void {
    if (index < 0 || index >= this._length) {
      throw new Error("Index out of bounds");
    }
    this.data[index] = value;
  }

  /**
   * O(1) 분할 상환 시간 (Amortized) - 배열 끝에 요소 추가
   */
  public push(value: T): void {
    if (this._length === this._capacity) {
      this.resize();
    }
    this.data[this._length] = value;
    this._length++;
  }

  /**
   * O(1) - 배열 끝의 요소 제거 및 반환
   */
  public pop(): T | undefined {
    if (this._length === 0) return undefined;

    const lastItem = this.data[this._length - 1];
    delete this.data[this._length - 1]; // 메모리 해제 시뮬레이션
    this._length--;
    
    // 선택적: 메모리 절약을 위해 length가 capacity의 1/4 이하로 떨어지면 축소(shrink)할 수도 있습니다.
    return lastItem;
  }

  /**
   * O(N) - 특정 위치에 요소 삽입. 빈 공간을 만들기 위해 우측 요소들을 모두 한 칸씩 밀어냄.
   */
  public insertAt(index: number, value: T): void {
    if (index < 0 || index > this._length) {
      throw new Error("Index out of bounds");
    }

    if (this._length === this._capacity) {
      this.resize();
    }

    // 뒤에서부터 index까지의 요소를 한 칸씩 오른쪽으로 이동 (Shift)
    for (let i = this._length; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }

    this.data[index] = value;
    this._length++;
  }

  /**
   * O(N) - 특정 위치의 요소 삭제. 빈 공간을 채우기 위해 우측 요소들을 모두 한 칸씩 당김.
   */
  public removeAt(index: number): T | undefined {
    if (index < 0 || index >= this._length) {
      return undefined;
    }

    const removedItem = this.data[index];

    // index 바로 다음부터 끝까지의 요소를 한 칸씩 왼쪽으로 이동 (Shift)
    for (let i = index; i < this._length - 1; i++) {
      this.data[i] = this.data[i + 1];
    }

    // 마지막에 중복된 데이터를 제거하고 길이를 줄임
    delete this.data[this._length - 1];
    this._length--;

    return removedItem;
  }

  /**
   * O(N) - 내부 배열 용량(Capacity) 확장
   */
  private resize(): void {
    const newCapacity = this._capacity * 2;
    const newData: Record<number, T> = {};

    // 기존 데이터 복사
    for (let i = 0; i < this._length; i++) {
      newData[i] = this.data[i];
    }

    this.data = newData;
    this._capacity = newCapacity;
  }
}
