import { TrieNode } from "./trie-node";

export class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEnd = true;
  }

  search(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }

    return node.isEnd;
  }

  startsWith(prefix: string): boolean {
    let node = this.root;

    for (const char of prefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }

    return true;
  }

  private findNode(node: TrieNode, prefix: string): boolean {
    for (const char of prefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char)!;
    }

    return true;
  }

  private dfs(node: TrieNode, prefix: string, results: string[]): void {
    if (node.isEnd) {
      results.push(prefix);
    }

    for (const [char, childNode] of node.children.entries()) {
      this.dfs(childNode, prefix + char, results);
    }
  }

  autoComplete(prefix: string): string[] {
    let node = this.root;

    if (!this.findNode(node, prefix)) {
      return [];
    }

    const results: string[] = [];
    this.dfs(node, prefix, results);

    return results.sort((a, b) => a.localeCompare(b));
  }

  delete(word: string): void {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        return;
      }
      node = node.children.get(char)!;
    }

    node.isEnd = false;
  }
}
