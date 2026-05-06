/**
 * Deque (Double-Ended Queue) 구현을 위한 이중 연결 리스트 노드
 * 단일 연결 리스트(Singly Linked List)는 맨 뒤(Tail)의 요소를 지울 때 O(N)이 소요됩니다.
 * 양쪽 끝에서 완벽한 O(1) 성능을 내기 위해 앞뒤로 연결된 Doubly Linked List 구조를 사용합니다.
 */
class DoublyListNode<T> {
  public value: T;
  public next: DoublyListNode<T> | null;
  public prev: DoublyListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * Deque (Double-Ended Queue) 구현 (Doubly Linked List 기반)
 */
export class Deque<T> {
  private head: DoublyListNode<T> | null;
  private tail: DoublyListNode<T> | null;
  private _length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this._length = 0;
  }

  /**
   * O(1) - 덱의 맨 앞(Front)에 데이터 추가
   */
  public addFront(value: T): void {
    const newNode = new DoublyListNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this.head = newNode;
    }
    this._length++;
  }

  /**
   * O(1) - 덱의 맨 뒤(Rear)에 데이터 추가
   */
  public addRear(value: T): void {
    const newNode = new DoublyListNode(value);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this._length++;
  }

  /**
   * O(1) - 덱의 맨 앞(Front)에서 데이터 제거 및 반환
   */
  public removeFront(): T | null {
    if (this.isEmpty()) return null;

    const removedNode = this.head!;
    this.head = this.head!.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      // 덱이 비어버린 경우
      this.tail = null;
    }

    this._length--;
    return removedNode.value;
  }

  /**
   * O(1) - 덱의 맨 뒤(Rear)에서 데이터 제거 및 반환
   * (단일 연결 리스트였다면 O(N)이 걸렸을 작업)
   */
  public removeRear(): T | null {
    if (this.isEmpty()) return null;

    const removedNode = this.tail!;
    this.tail = this.tail!.prev;

    if (this.tail) {
      this.tail.next = null;
    } else {
      // 덱이 비어버린 경우
      this.head = null;
    }

    this._length--;
    return removedNode.value;
  }

  /**
   * O(1) - 맨 앞 데이터 확인
   */
  public peekFront(): T | null {
    return this.head ? this.head.value : null;
  }

  /**
   * O(1) - 맨 뒤 데이터 확인
   */
  public peekRear(): T | null {
    return this.tail ? this.tail.value : null;
  }

  public isEmpty(): boolean {
    return this._length === 0;
  }

  public get size(): number {
    return this._length;
  }

  public toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

/**
 * 비교용 Array 기반 Deque 구현
 * 맨 앞 추가(unshift) 및 제거(shift) 시 O(N) 페널티 발생
 */
export class ArrayDeque<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  public addFront(value: T): void {
    this.items.unshift(value); // O(N)
  }

  public addRear(value: T): void {
    this.items.push(value); // 상각 O(1)
  }

  public removeFront(): T | undefined {
    return this.items.shift(); // O(N)
  }

  public removeRear(): T | undefined {
    return this.items.pop(); // 상각 O(1)
  }

  public peekFront(): T | undefined {
    return this.items[0];
  }

  public peekRear(): T | undefined {
    return this.items[this.items.length - 1];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public get size(): number {
    return this.items.length;
  }
}
