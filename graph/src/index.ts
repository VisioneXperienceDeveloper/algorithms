import { Graph } from "./graph";

const runGraphTest = () => {
  console.log("=== Graph & Algorithms Test ===");

  // 1. 소셜 네트워크 (친구 관계) 탐색 - 무방향 비가중치 그래프
  console.log("\n[1] Social Network (DFS & BFS)");
  const socialNetwork = new Graph(false); // Undirected

  const people = ["A", "B", "C", "D", "E", "F"];
  people.forEach(p => socialNetwork.addVertex(p));

  // 간선 연결
  socialNetwork.addEdge("A", "B");
  socialNetwork.addEdge("A", "C");
  socialNetwork.addEdge("B", "D");
  socialNetwork.addEdge("C", "E");
  socialNetwork.addEdge("D", "E");
  socialNetwork.addEdge("D", "F");
  socialNetwork.addEdge("E", "F");

  /*
   * 구조:
   *      A
   *    /   \
   *   B     C
   *   |     |
   *   D --- E
   *    \   /
   *      F
   */

  console.log("- DFS (재귀):", socialNetwork.dfs("A").join(" -> ")); 
  // 예상: A -> B -> D -> E -> C -> F (탐색 순서는 인접 리스트의 삽입 순서에 따라 조금 다를 수 있음)
  
  console.log("- BFS (큐):", socialNetwork.bfs("A").join(" -> "));
  // 예상: A -> B -> C -> D -> E -> F (A에서 1촌 -> 2촌 -> 3촌 순서로 탐색)

  // 2. 지도 경로 탐색 (다익스트라 알고리즘) - 무방향 가중치 그래프
  console.log("\n[2] City Map (Dijkstra Shortest Path)");
  const cityMap = new Graph(false);

  // A=Seoul, B=Daejeon, C=Daegu, D=Busan, E=Gwangju, F=Mokpo
  const cities = ["Seoul", "Daejeon", "Daegu", "Busan", "Gwangju", "Mokpo"];
  cities.forEach(city => cityMap.addVertex(city));

  // 거리 가중치 (임의)
  cityMap.addEdge("Seoul", "Daejeon", 140);
  cityMap.addEdge("Seoul", "Gwangju", 270);
  cityMap.addEdge("Daejeon", "Daegu", 130);
  cityMap.addEdge("Daejeon", "Gwangju", 140);
  cityMap.addEdge("Daegu", "Busan", 110);
  cityMap.addEdge("Gwangju", "Busan", 200);
  cityMap.addEdge("Gwangju", "Mokpo", 70);

  const startCity = "Seoul";
  const targetCity = "Busan";

  const startDijkstra = performance.now();
  const shortestPath = cityMap.dijkstra(startCity, targetCity);
  const endDijkstra = performance.now();

  console.log(`- 최단 경로 (${startCity} -> ${targetCity}):`, shortestPath.join(" -> "));
  // 예상: Seoul -> Daejeon -> Daegu -> Busan (140 + 130 + 110 = 380)
  // Gwangju를 거쳐가면 Seoul -> Daejeon -> Gwangju -> Busan (140 + 140 + 200 = 480) 이므로 채택되지 않음.
  console.log(`- 소요 시간: ${(endDijkstra - startDijkstra).toFixed(4)}ms (Heap 최적화 적용)`);

  console.log("\n=== Graph Test Finished ===");
};

runGraphTest();
