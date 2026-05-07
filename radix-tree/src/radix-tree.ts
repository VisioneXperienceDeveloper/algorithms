export class RadixNode {
  // Edge 라벨 단위로 자식을 가집니다. (기본 Trie는 char 단위)
  public children: Map<string, RadixNode>;
  public isEndOfWord: boolean;

  constructor(isEndOfWord: boolean = false) {
    this.children = new Map();
    this.isEndOfWord = isEndOfWord;
  }
}

/**
 * Radix Tree (Compressed Trie) 구현
 * 
 * 일반 Trie가 알파벳 하나당 노드를 생성하여 극심한 메모리 낭비와 깊은 트리를 만드는 반면,
 * Radix Tree는 가지가 나뉘지 않는 문자열을 하나의 노드로 압축(Compress)합니다.
 * 라우터(Router), IP 라우팅, 검색어 자동완성 등에 필수적인 자료구조입니다.
 */
export class RadixTree {
  public root: RadixNode;

  constructor() {
    this.root = new RadixNode();
  }

  /**
   * 문자열 간의 가장 긴 공통 접두사(Longest Common Prefix)의 길이를 찾습니다.
   */
  private getCommonPrefixLength(str1: string, str2: string): number {
    let i = 0;
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
      i++;
    }
    return i;
  }

  public insert(word: string): void {
    let currentNode = this.root;
    let currentWord = word;

    while (currentWord.length > 0) {
      let matchFound = false;

      for (const [edgeLabel, childNode] of currentNode.children.entries()) {
        const commonLen = this.getCommonPrefixLength(edgeLabel, currentWord);

        if (commonLen > 0) {
          matchFound = true;

          // Case 1: edgeLabel과 currentWord가 완벽히 일치할 때 ("apple" 인데 이미 "apple" 간선이 존재)
          if (commonLen === edgeLabel.length && commonLen === currentWord.length) {
            childNode.isEndOfWord = true;
            return;
          }

          // Case 2: edgeLabel 전체가 currentWord의 접두사일 때 ("app" 간선이 있고, "apple"을 넣을 때)
          if (commonLen === edgeLabel.length && commonLen < currentWord.length) {
            currentNode = childNode;
            currentWord = currentWord.substring(commonLen);
            break; // 내부 while 루프를 다음 노드에서 계속 진행
          }

          // Case 3: 쪼개야 하는 경우 (Split)
          // 예: "apple" 간선이 있는데 "apply"를 넣을 때 ("appl" 공통, "e"와 "y"로 분기)
          // 또는 "apple" 간선이 있는데 "app"을 넣을 때 ("app" 공통, "le"로 분기)
          const commonPrefix = edgeLabel.substring(0, commonLen);
          const remainingEdge = edgeLabel.substring(commonLen);
          const remainingWord = currentWord.substring(commonLen);

          // 1. 기존 간선 지우고 공통 접두사로 새 간선 만들기
          currentNode.children.delete(edgeLabel);
          const splitNode = new RadixNode();
          currentNode.children.set(commonPrefix, splitNode);

          // 2. 잘려나간 기존 간선(remainingEdge)을 새로 만든 노드의 자식으로 연결
          splitNode.children.set(remainingEdge, childNode);

          // 3. 삽입하려는 단어 처리
          if (remainingWord.length === 0) {
            // "apple"이 있는데 "app"을 넣는 경우 (currentWord가 더 짧음)
            splitNode.isEndOfWord = true;
          } else {
            // "apple"이 있는데 "apply"를 넣는 경우 (나머지 부분이 있음)
            const newLeaf = new RadixNode(true);
            splitNode.children.set(remainingWord, newLeaf);
          }

          return;
        }
      }

      // 루프를 다 돌았는데도 겹치는 접두사가 없었다면 그냥 새 간선을 추가합니다.
      if (!matchFound) {
        currentNode.children.set(currentWord, new RadixNode(true));
        return;
      }
    }
  }

  public search(word: string): boolean {
    let currentNode = this.root;
    let currentWord = word;

    while (currentWord.length > 0) {
      let matchFound = false;

      for (const [edgeLabel, childNode] of currentNode.children.entries()) {
        const commonLen = this.getCommonPrefixLength(edgeLabel, currentWord);

        if (commonLen > 0) {
          if (commonLen === edgeLabel.length) {
            // 해당 간선 전체가 일치하는 경우, 다음 자식으로 이동
            if (commonLen === currentWord.length) {
              return childNode.isEndOfWord;
            } else {
              currentNode = childNode;
              currentWord = currentWord.substring(commonLen);
              matchFound = true;
              break;
            }
          } else {
            // 공통 부분이 있지만 간선 라벨 길이보다 짧으면 찾을 수 없음
            return false;
          }
        }
      }

      if (!matchFound) return false;
    }
    return false;
  }

  public startsWith(prefix: string): boolean {
    let currentNode = this.root;
    let currentPrefix = prefix;

    while (currentPrefix.length > 0) {
      let matchFound = false;

      for (const [edgeLabel, childNode] of currentNode.children.entries()) {
        const commonLen = this.getCommonPrefixLength(edgeLabel, currentPrefix);

        if (commonLen > 0) {
          // 찾고자 하는 prefix가 간선 내에서 끝나는 경우 ("app" 찾는데 "apple" 간선 만남)
          if (commonLen === currentPrefix.length) {
            return true;
          }

          // prefix가 더 남은 경우, 다음 노드로 이동 ("apple" 찾는데 "app" 간선 만남)
          if (commonLen === edgeLabel.length) {
            currentNode = childNode;
            currentPrefix = currentPrefix.substring(commonLen);
            matchFound = true;
            break;
          }
        }
      }

      if (!matchFound) return false;
    }
    return true;
  }

  /**
   * 성능 벤치마크 및 압축률 증명을 위해 총 생성된 노드의 개수를 반환합니다.
   */
  public countNodes(): number {
    return this._countNodesHelper(this.root);
  }

  private _countNodesHelper(node: RadixNode): number {
    let count = 1; // 자기 자신
    for (const child of node.children.values()) {
      count += this._countNodesHelper(child);
    }
    return count;
  }
}
