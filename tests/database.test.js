const { ref, set, get } = require("firebase/database");
const { db } = require("../firebase"); // Adjust the path based on your project structure

const testDatabase = async () => {
  try {
    const testRef = ref(db, "test");

    // Write test data
    await set(testRef, { message: "Hello, Firebase!" });
    console.log("Test data written successfully!");

    // Read test data
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      console.log("Test data fetched successfully:", snapshot.val());
    } else {
      console.log("No test data found.");
    }
  } catch (error) {
    console.error("Error testing Firebase Realtime Database:", error);
  }
};

testDatabase();
