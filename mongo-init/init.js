db = db.getSiblingDB("attendance_db");

db.createCollection("members");
db.createCollection("eventsheets");

db.members.insertMany([
  { memberId: "M001", name: "Alice Johnson" },
  { memberId: "M002", name: "Bob Smith" },
  { memberId: "M003", name: "Carol Williams" },
  { memberId: "M004", name: "David Brown" },
  { memberId: "M005", name: "Eva Martinez" },
  { memberId: "M006", name: "Frank Lee" },
  { memberId: "M007", name: "Grace Kim" },
  { memberId: "M008", name: "Henry Davis" },
  { memberId: "M009", name: "Iris Chen" },
  { memberId: "M010", name: "James Wilson" },
]);

print("Database initialized with 10 members.");
