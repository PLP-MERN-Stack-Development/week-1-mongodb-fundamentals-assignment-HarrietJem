/**********************
  INITIAL SETUP & UTILITIES  
**********************/
print("=== MONGODB BOOKSTORE QUERIES ===");
print("Database: " + db.getName() + "\n");

// Helper function to display results
function showResults(description, query) {
  print("\n" + "=".repeat(50));
  print("QUERY: " + description);
  print("=".repeat(50));
  
  if (typeof query === "function") {
    query().forEach(printjson);
  } else {
    query.forEach(printjson);
  }
}

/**********************
  TASK 2: BASIC CRUD OPERATIONS  
**********************/
showResults("1. Find all Fiction books", 
  () => db.books.find({ genre: "Fiction" }));

showResults("2. Books published after 2000", 
  db.books.find({ published_year: { $gt: 2000 } }));

// Add all other CRUD operations here in the same format

/**********************
  TASK 3: ADVANCED QUERIES  
**********************/
showResults("3. In-stock books published after 2010", 
  db.books.find({ 
    in_stock: true, 
    published_year: { $gt: 2010 } 
  }));

showResults("4. Books with only title, author, price", 
  db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }));

// Add other advanced queries here

/**********************
  TASK 4: AGGREGATION PIPELINES  
**********************/
showResults("5. Average price by genre", 
  db.books.aggregate([
    { $group: { 
      _id: "$genre", 
      avgPrice: { $avg: "$price" } 
    }}
  ]));

showResults("6. Author with most books", 
  db.books.aggregate([
    { $group: { 
      _id: "$author", 
      bookCount: { $sum: 1 } 
    }},
    { $sort: { bookCount: -1 } },
    { $limit: 1 }
  ]));

  TASK 5: INDEXING  

print("\n" + "=".repeat(50));
print("INDEXING OPERATIONS");
print("=".repeat(50));

print("\nCreating index on 'title'...");
db.books.createIndex({ title: 1 });

print("Creating compound index on author + published_year...");
db.books.createIndex({ author: 1, published_year: 1 });

showResults("Performance test for title search", 
  () => db.books.find({ title: "The Great Gatsby" }).explain("executionStats"));

  // 1. Average price by genre
print("\n===== Aggregation: Average price by genre =====");
db.books.aggregate([
    { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]).forEach(printjson);

// 2. Author with most books
print("\n===== Aggregation: Author with most books =====");
db.books.aggregate([
    { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
    { $sort: { totalBooks: -1 } },
    { $limit: 1 }
]).forEach(printjson);

// 3. Books count by publication decade
print("\n===== Aggregation: Books count by decade =====");
db.books.aggregate([
    { $project: { decade: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] } } },
    { $group: { _id: "$decade", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
]).forEach(printjson);