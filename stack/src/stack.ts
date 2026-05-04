import { LinkedList } from "../../linked-list/src/linkedList";

/**
 * Stack 구현 (Linked List 기반)
 * 
 * Stack은 LIFO (Last-In, First-Out) 원칙을 따르는 선형 자료구조입니다.
 * Array로도 구현할 수 있지만, 메모리 재할당(Reallocation) 오버헤드를 완벽히
 * 제거하기 위해 이전에 구현한 Linked List를 기반으로 구현합니다.
 */
export class Stack<T> {
  private list: LinkedList<T>;

  constructor() {
    this.list = new LinkedList<T>();
  }

  /**
   * O(1) - 스택의 맨 위(Top)에 데이터 추가
   * Linked List의 맨 앞(head)에 삽입합니다. (prepend 사용)
   */
  public push(value: T): void {
    this.list.prepend(value);
  }

  /**
   * O(1) - 스택의 맨 위(Top)에서 데이터 제거 및 반환
   * Linked List의 맨 앞(head)에서 삭제합니다.
   */
  public pop(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    // LinkedList의 첫 번째 요소 제거 (removeAt(0))
    return this.list.removeAt(0);
  }

  /**
   * O(1) - 스택의 맨 위(Top) 데이터 확인 (제거하지 않음)
   */
  public peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    // Linked List의 첫 번째 요소 조회
    const headNode = this.list.get(0);
    return headNode ? headNode.value : null;
  }

  /**
   * O(1) - 스택이 비어있는지 확인
   */
  public isEmpty(): boolean {
    return this.list.isEmpty();
  }

  /**
   * O(1) - 스택의 현재 크기 반환
   */
  public get size(): number {
    return this.list.length;
  }

  /**
   * 확인용: 스택의 상태를 배열로 변환
   */
  public toArray(): T[] {
    return this.list.toArray();
  }
}

/**
 * 비교를 위한 Array 기반 Stack 구현 (TypeScript 내장 Array 사용)
 */
export class ArrayStack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  public push(value: T): void {
    this.items.push(value);
  }

  public pop(): T | undefined {
    return this.items.pop();
  }

  public peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public get size(): number {
    return this.items.length;
  }
}
