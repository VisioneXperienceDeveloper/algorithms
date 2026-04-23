import { IObserver } from "../../core/observer";

export class ObservableQueue<T> {
  private data: T[] = [];
  public observer?: IObserver<T>;

  public enqueue(value: T): void {
    this.data.push(value);
    this.observer?.onEvent("insert", value, this.data.length - 1);
  }

  public dequeue(): T | undefined {
    if (this.data.length === 0) return undefined;
    const value = this.data.shift();
    this.observer?.onEvent("delete", value, 0);
    return value;
  }

  public peek(): T | undefined {
    if (this.data.length === 0) return undefined;
    const value = this.data[0];
    this.observer?.onEvent("access", value, 0);
    return value;
  }

  public get length(): number {
    return this.data.length;
  }
  
  public toArray(): T[] {
    return [...this.data];
  }
}
