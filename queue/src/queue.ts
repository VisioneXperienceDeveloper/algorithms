import { LinkedList } from "../../linked-list/src/linkedList";

/**
 * Queue 구현 (Linked List 기반)
 * 
 * Queue는 FIFO (First-In, First-Out) 원칙을 따르는 선형 자료구조입니다.
 * 자바스크립트의 Array를 사용하여 Queue를 구현할 경우, 요소를 꺼낼 때(shift)
 * 배열의 모든 요소를 앞으로 당겨야 하므로 O(N)의 성능 저하가 발생합니다.
 * 이를 방지하기 위해 이전에 구현한 Linked List를 기반으로 완벽한 O(1) Queue를 구현합니다.
 */
export class Queue<T> {
  private list: LinkedList<T>;

  constructor() {
    this.list = new LinkedList<T>();
  }

  /**
   * O(1) - 큐의 맨 뒤(Rear)에 데이터 추가
   * Linked List의 맨 뒤(tail)에 삽입합니다. (append 사용)
   */
  public enqueue(value: T): void {
    this.list.append(value);
  }

  /**
   * O(1) - 큐의 맨 앞(Front)에서 데이터 제거 및 반환
   * Linked List의 맨 앞(head)에서 삭제합니다.
   */
  public dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    // LinkedList의 첫 번째 요소 제거
    return this.list.removeAt(0);
  }

  /**
   * O(1) - 큐의 맨 앞(Front) 데이터 확인 (제거하지 않음)
   */
  public peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    const headNode = this.list.get(0);
    return headNode ? headNode.value : null;
  }

  /**
   * O(1) - 큐가 비어있는지 확인
   */
  public isEmpty(): boolean {
    return this.list.isEmpty();
  }

  /**
   * O(1) - 큐의 현재 크기 반환
   */
  public get size(): number {
    return this.list.length;
  }

  /**
   * 확인용: 큐의 상태를 배열로 변환
   */
  public toArray(): T[] {
    return this.list.toArray();
  }
}

/**
 * 비교를 위한 Array 기반 Queue 구현 (TypeScript 내장 Array 사용)
 * 주의: dequeue() 시 shift() 연산을 사용하므로 O(N)의 시간이 소요됩니다.
 */
export class ArrayQueue<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  public enqueue(value: T): void {
    this.items.push(value);
  }

  public dequeue(): T | undefined {
    // Array의 shift는 0번째를 제거하고 나머지 모든 요소를 앞으로 한 칸씩 당겨야 함 (O(N))
    return this.items.shift();
  }

  public peek(): T | undefined {
    return this.items[0];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public get size(): number {
    return this.items.length;
  }
}
