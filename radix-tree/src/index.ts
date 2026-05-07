import { RadixTree } from "./radix-tree";

// 일반 Trie 구현 (비교용)
class TrieNode {
  public children: Map<string, TrieNode>;
  public isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class StandardTrie {
  public root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  public insert(word: string): void {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true;
  }

  public countNodes(): number {
    return this._countNodesHelper(this.root);
  }

  private _countNodesHelper(node: TrieNode): number {
    let count = 1;
    for (const child of node.children.values()) {
      count += this._countNodesHelper(child);
    }
    return count;
  }
}

function runRadixTreeTests() {
  console.log("=== Radix Tree (Compressed Trie) 기능 테스트 ===");
  const radix = new RadixTree();

  radix.insert("apple");
  radix.insert("app");
  radix.insert("apply");
  radix.insert("banana");
  radix.insert("bandana");
  radix.insert("band");

  console.log("1. 검색 테스트:");
  console.log(" - search('apple'):", radix.search("apple")); // true
  console.log(" - search('app'):", radix.search("app")); // true
  console.log(" - search('appl'):", radix.search("appl")); // false
  console.log(" - search('bandana'):", radix.search("bandana")); // true
  console.log(" - search('ban'):", radix.search("ban")); // false

  console.log("\n2. 접두사 검색 테스트:");
  console.log(" - startsWith('app'):", radix.startsWith("app")); // true
  console.log(" - startsWith('ban'):", radix.startsWith("ban")); // true
  console.log(" - startsWith('banda'):", radix.startsWith("banda")); // true
  console.log(" - startsWith('cat'):", radix.startsWith("cat")); // false

  console.log("\n=== 메모리(노드 수) 압축률 벤치마크 (Standard Trie vs Radix Tree) ===");
  // 테스트 데이터셋: 라우터 시스템의 URL 경로와 유사한 긴 문자열
  const dataset = [
    "users/profile/edit",
    "users/profile/view",
    "users/settings/account",
    "users/settings/security",
    "products/electronics/laptop",
    "products/electronics/phone",
    "products/clothing/shirt",
    "company/about-us",
    "company/contact",
    "company/careers"
  ];

  const standardTrie = new StandardTrie();
  const radixTree = new RadixTree();

  for (const word of dataset) {
    standardTrie.insert(word);
    radixTree.insert(word);
  }

  const trieNodes = standardTrie.countNodes();
  const radixNodes = radixTree.countNodes();

  console.log(`[데이터셋] URL 라우팅 경로 ${dataset.length}개 삽입`);
  console.log(`- 일반 Trie 노드 개수: ${trieNodes}개 (알파벳마다 노드 생성)`);
  console.log(`- Radix Tree 노드 개수: ${radixNodes}개 (공통되지 않는 경로는 문자열로 압축)`);
  console.log(`=> 메모리 사용량(노드 수) 약 ${((1 - radixNodes / trieNodes) * 100).toFixed(1)}% 감소!`);

  console.log("\n[분석 결과]");
  console.log(" - 일반 Trie는 공통 접두사가 없는 단일 경로라도 매 글자마다 새로운 객체(Node)를 생성하여 막대한 메모리를 낭비합니다.");
  console.log(" - Radix Tree는 분기가 일어나지 않는 문자열 구간을 하나의 노드(간선 라벨)로 묶어 압축합니다.");
  console.log(" - HTTP 라우터(Next.js App Router 내부 구조 등)나 IP 주소 라우팅 테이블(IPv4/IPv6) 구현 시 핵심적으로 쓰입니다.");
}

runRadixTreeTests();
