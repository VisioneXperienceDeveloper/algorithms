import { Trie } from "./trie";

const trie = new Trie();
trie.insert("apple");
trie.insert("app");
trie.insert("banana");

console.log(trie.search("apple")); // true
console.log(trie.search("app")); // true
console.log(trie.search("banana")); // true
console.log(trie.search("orange")); // false

console.log(trie.startsWith("app")); // true
console.log(trie.startsWith("ban")); // true
console.log(trie.startsWith("ora")); // false

console.log(trie.autoComplete("app")); // ["app", "apple"]

trie.delete("app");
console.log(trie.search("app")); // false
console.log(trie.search("apple")); // true
