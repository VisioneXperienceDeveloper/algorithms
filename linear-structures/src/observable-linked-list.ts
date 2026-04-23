import { IObserver } from "../../core/observer";

export class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

export class ObservableLinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private _length: number = 0;
  public observer?: IObserver<T>;

  public append(value: T): void {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this._length++;
    this.observer?.onEvent("insert", newNode, this._length - 1);
  }

  public prepend(value: T): void {
    const newNode = new ListNode(value, this.head);
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    this._length++;
    this.observer?.onEvent("insert", newNode, 0);
  }

  public find(value: T): ListNode<T> | null {
    let curr = this.head;
    let index = 0;
    while (curr) {
      this.observer?.onEvent("visit", curr, index);
      this.observer?.onEvent("compare", curr.value, value);
      if (curr.value === value) {
        return curr;
      }
      curr = curr.next;
      index++;
    }
    return null;
  }

  public delete(value: T): boolean {
    if (!this.head) return false;

    if (this.head.value === value) {
      this.observer?.onEvent("delete", this.head, 0);
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this._length--;
      return true;
    }

    let curr = this.head;
    let index = 0;
    while (curr.next) {
      this.observer?.onEvent("visit", curr.next, index + 1);
      this.observer?.onEvent("compare", curr.next.value, value);
      if (curr.next.value === value) {
        this.observer?.onEvent("delete", curr.next, index + 1);
        curr.next = curr.next.next;
        if (!curr.next) {
          this.tail = curr;
        }
        this._length--;
        return true;
      }
      curr = curr.next;
      index++;
    }

    return false;
  }

  public get length(): number {
    return this._length;
  }

  public getHead(): ListNode<T> | null {
    return this.head;
  }
}
