import { IObserver } from "../../core/observer";

export class ObservableStack<T> {
  private data: T[] = [];
  public observer?: IObserver<T>;

  public push(value: T): void {
    this.data.push(value);
    this.observer?.onEvent("insert", value, this.data.length - 1);
  }

  public pop(): T | undefined {
    if (this.data.length === 0) return undefined;
    const value = this.data.pop();
    this.observer?.onEvent("delete", value, this.data.length);
    return value;
  }

  public peek(): T | undefined {
    if (this.data.length === 0) return undefined;
    const value = this.data[this.data.length - 1];
    this.observer?.onEvent("access", value, this.data.length - 1);
    return value;
  }

  public get length(): number {
    return this.data.length;
  }
  
  public toArray(): T[] {
    return [...this.data];
  }
}
