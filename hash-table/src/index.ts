import { HashTable } from "./hash-table";

const main = () => {
  console.log("=== HashTable Testing Started ===");
  const hashTable = new HashTable(5); // Start with small size to test resizing

  // 1. Basic Set & Get
  console.log("\n[1. Basic Operations]");
  hashTable.set("name", "John");
  hashTable.set("age", 30);
  hashTable.set("city", "Seoul");
  
  console.log("name:", hashTable.get("name")); // John
  console.log("age:", hashTable.get("age"));   // 30
  console.log("city:", hashTable.get("city")); // Seoul

  // 2. Value Update (Duplicate Key)
  console.log("\n[2. Update Value]");
  hashTable.set("age", 31);
  console.log("updated age:", hashTable.get("age")); // 31

  // 3. Deletion Test
  console.log("\n[3. Data Deletion]");
  console.log("delete name:", hashTable.delete("name")); // true
  console.log("get name after delete:", hashTable.get("name")); // undefined

  // 4. Resizing Test
  console.log("\n[4. Resizing Test]");
  console.log("Current Stats:", hashTable.getStats());
  
  const moreData = [
    ["a", 1], ["b", 2], ["c", 3], ["d", 4], ["e", 5], ["f", 6]
  ];
  moreData.forEach(([k, v]) => hashTable.set(k as string, v));
  
  console.log("Stats after resizing:", hashTable.getStats());
  console.log("Verify data (key 'f'):", hashTable.get("f")); // 6
  
  console.log("\n=== HashTable Testing Finished ===");
};

main();
