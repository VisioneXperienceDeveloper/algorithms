import { Heap } from "../../heap/src/heap";

export interface Edge {
  node: string;
  weight: number;
}

/**
 * 인접 리스트(Adjacency List) 기반의 범용 Graph 클래스
 */
export class Graph {
  // 인접 리스트: 노드 이름 -> 간선 배열
  private adjacencyList: Map<string, Edge[]>;
  private isDirected: boolean;

  constructor(isDirected: boolean = false) {
    this.adjacencyList = new Map();
    this.isDirected = isDirected;
  }

  /**
   * 노드(Vertex)를 추가합니다. O(1)
   */
  public addVertex(vertex: string): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  /**
   * 간선(Edge)을 추가합니다. O(1)
   */
  public addEdge(v1: string, v2: string, weight: number = 1): void {
    // 노드가 없으면 자동 생성
    this.addVertex(v1);
    this.addVertex(v2);

    this.adjacencyList.get(v1)!.push({ node: v2, weight });

    // 양방향 그래프인 경우 반대 방향도 추가
    if (!this.isDirected) {
      this.adjacencyList.get(v2)!.push({ node: v1, weight });
    }
  }

  /**
   * 간선을 제거합니다. O(E)
   */
  public removeEdge(v1: string, v2: string): void {
    if (this.adjacencyList.has(v1)) {
      this.adjacencyList.set(
        v1,
        this.adjacencyList.get(v1)!.filter((edge) => edge.node !== v2)
      );
    }
    if (!this.isDirected && this.adjacencyList.has(v2)) {
      this.adjacencyList.set(
        v2,
        this.adjacencyList.get(v2)!.filter((edge) => edge.node !== v1)
      );
    }
  }

  /**
   * 노드와 그에 연결된 모든 간선을 제거합니다. O(V + E)
   */
  public removeVertex(vertex: string): void {
    if (!this.adjacencyList.has(vertex)) return;

    // 양방향 그래프이거나, 단방향이더라도 안전하게 모든 노드에서 해당 노드를 가리키는 간선을 제거해야 함
    for (const [v, edges] of this.adjacencyList.entries()) {
      if (v !== vertex) {
        this.adjacencyList.set(
          v,
          edges.filter((edge) => edge.node !== vertex)
        );
      }
    }

    this.adjacencyList.delete(vertex);
  }

  /**
   * 깊이 우선 탐색 (DFS) - 재귀 방식
   */
  public dfs(start: string): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const adjacencyList = this.adjacencyList;

    function traverse(vertex: string) {
      if (!vertex) return;
      visited.add(vertex);
      result.push(vertex);

      const neighbors = adjacencyList.get(vertex) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          traverse(neighbor.node);
        }
      }
    }

    traverse(start);
    return result;
  }

  /**
   * 너비 우선 탐색 (BFS) - 큐 방식
   */
  public bfs(start: string): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const queue: string[] = [start];

    visited.add(start);

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          queue.push(neighbor.node);
        }
      }
    }

    return result;
  }

  /**
   * 다익스트라(Dijkstra) 최단 경로 알고리즘
   * 이전 단계에서 구현한 Heap(Priority Queue)을 활용하여 O((V+E)logV) 성능을 달성합니다.
   */
  public dijkstra(start: string, finish: string): string[] {
    // Min-Heap (가장 거리가 짧은 노드가 우선순위가 높음)
    const pq = new Heap<{ node: string; distance: number }>(
      (a, b) => a.distance - b.distance
    );
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const path: string[] = [];

    // 초기 상태 세팅
    for (const vertex of this.adjacencyList.keys()) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.push({ node: vertex, distance: 0 });
      } else {
        distances[vertex] = Infinity;
        // 최적화를 위해 초기에 모든 노드를 Heap에 넣지 않고 거리가 갱신될 때만 넣음 (Lazy Insertion)
      }
      previous[vertex] = null;
    }

    while (!pq.isEmpty) {
      const smallest = pq.pop();
      if (!smallest) break;

      const currentVertex = smallest.node;

      // 목적지에 도달했으면 경로를 역추적하여 빌드
      if (currentVertex === finish) {
        let curr: string | null = finish;
        while (curr) {
          path.push(curr);
          curr = previous[curr];
        }
        break; // 찾았으므로 종료
      }

      // 이미 처리된(더 짧은 거리로 갱신된) 낡은 정보면 무시
      if (smallest.distance > distances[currentVertex]) continue;

      const neighbors = this.adjacencyList.get(currentVertex);
      if (neighbors) {
        for (const neighbor of neighbors) {
          const nextNode = neighbor.node;
          // 현재까지의 거리 + 이웃까지의 가중치
          const candidateDistance = distances[currentVertex] + neighbor.weight;

          // 더 짧은 경로를 발견한 경우
          if (candidateDistance < distances[nextNode]) {
            distances[nextNode] = candidateDistance;
            previous[nextNode] = currentVertex;
            pq.push({ node: nextNode, distance: candidateDistance });
          }
        }
      }
    }

    return path.reverse();
  }
}
