import { IObserver } from "../../core/observer";

export class ObservableArray<T> {
  private data: T[] = [];
  public observer?: IObserver<T>;

  constructor(initialData: T[] = []) {
    this.data = [...initialData];
  }

  public get(index: number): T | undefined {
    this.observer?.onEvent("access", this.data[index], index);
    return this.data[index];
  }

  public set(index: number, value: T): void {
    this.data[index] = value;
    this.observer?.onEvent("update", value, index);
  }

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

  public removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.data.length) return undefined;
    const value = this.data[index];
    this.data.splice(index, 1);
    this.observer?.onEvent("delete", value, index);
    return value;
  }

  public swap(index1: number, index2: number): void {
    this.observer?.onEvent("access", this.data[index1], index1);
    this.observer?.onEvent("access", this.data[index2], index2);
    
    const temp = this.data[index1];
    this.data[index1] = this.data[index2];
    this.data[index2] = temp;
    
    this.observer?.onEvent("swap", this.data[index1], this.data[index2], index1, index2);
  }

  public get length(): number {
    return this.data.length;
  }
  
  public toArray(): T[] {
    return [...this.data];
  }
}
