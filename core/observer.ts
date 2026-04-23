export type ObserverEvent = "access" | "compare" | "swap" | "insert" | "delete" | "update" | "rebalance";

export interface IObserver<T = any> {
  onEvent(event: ObserverEvent, ...args: any[]): void;
}
