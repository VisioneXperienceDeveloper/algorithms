export class ListNode<T> {
  public value: T;
  public next: ListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

/**
 * Head와 Tail 포인터를 모두 가지는 단일 연결 리스트 (Singly Linked List)
 */
export class LinkedList<T> {
  private head: ListNode<T> | null;
  private tail: ListNode<T> | null;
  private _length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this._length = 0;
  }

  public get length(): number {
    return this._length;
  }

  public isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * O(1) - 리스트의 맨 뒤에 노드 추가 (tail 포인터 활용)
   */
  public append(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this._length++;
  }

  /**
   * O(1) - 리스트의 맨 앞에 노드 추가
   */
  public prepend(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this._length++;
  }

  /**
   * O(N) - 특정 인덱스의 노드 조회
   */
  public get(index: number): ListNode<T> | null {
    if (index < 0 || index >= this._length) return null;

    let current = this.head;
    let count = 0;

    while (current !== null && count < index) {
      current = current.next;
      count++;
    }

    return current;
  }

  /**
   * O(N) - 특정 위치에 노드 삽입 (탐색 O(N) + 포인터 갱신 O(1))
   */
  public insertAt(index: number, value: T): void {
    if (index < 0 || index > this._length) {
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      this.prepend(value);
      return;
    }
    if (index === this._length) {
      this.append(value);
      return;
    }

    const newNode = new ListNode(value);
    const prevNode = this.get(index - 1); // 삽입하려는 위치의 바로 앞 노드를 찾음

    if (prevNode) {
      newNode.next = prevNode.next;
      prevNode.next = newNode;
      this._length++;
    }
  }

  /**
   * O(N) - 특정 위치의 노드 삭제 (탐색 O(N) + 포인터 갱신 O(1))
   */
  public removeAt(index: number): T | null {
    if (index < 0 || index >= this._length) return null;
    if (!this.head) return null;

    let removedNode: ListNode<T> | null = null;

    // 맨 앞 요소 삭제
    if (index === 0) {
      removedNode = this.head;
      this.head = this.head.next;
      
      // 요소가 하나뿐이었다면 tail도 null로 처리
      if (this._length === 1) {
        this.tail = null;
      }
    } else {
      const prevNode = this.get(index - 1);
      if (prevNode && prevNode.next) {
        removedNode = prevNode.next;
        prevNode.next = removedNode.next;

        // 맨 뒤 요소를 삭제한 경우 tail 포인터 갱신
        if (index === this._length - 1) {
          this.tail = prevNode;
        }
      }
    }

    this._length--;
    return removedNode ? removedNode.value : null;
  }

  /**
   * 리스트 내용을 배열 형태로 반환 (출력/검증 용도)
   */
  public toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}
