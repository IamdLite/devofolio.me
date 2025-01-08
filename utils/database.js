// // const database = {};

// // // Save card state to the database
// // export const saveCardState = async (id, state) => {
// //   try {
// //     if (!id || !state) throw new Error("Invalid ID or state");
// //     database[id] = { ...state };
// //     console.log(`Saved to database (ID: ${id}):`, state);
// //   } catch (error) {
// //     console.error(`Error saving state (ID: ${id}):`, error);
// //     throw error; // Ensure the error can be caught where called
// //   }
// // };

// // // Retrieve card state from the database
// // export const getCardState = async (id) => {
// //   try {
// //     if (!id) throw new Error("Invalid ID");
// //     return database[id] || { reactions: { laugh: 0, notFunny: 0 }, comments: [] };
// //   } catch (error) {
// //     console.error(`Error retrieving state (ID: ${id}):`, error);
// //     throw error; // Ensure the error can be caught where called
// //   }
// // };

// import { getDatabase, ref, set, get, push, update, child } from "firebase/database";
// import { db } from "../firebase"; // Import the initialized Firebase Realtime Database instance

// // Save card state to Realtime Database
// export const saveCardState = async (id, state) => {
//   try {
//     if (!id || !state) throw new Error("Invalid ID or state");
//     const cardRef = ref(db, `memes/${id}`);
//     await set(cardRef, state);
//     console.log(`Saved to Realtime Database (ID: ${id}):`, state);
//   } catch (error) {
//     console.error(`Error saving to Realtime Database (ID: ${id}):`, error);
//     throw error;
//   }
// };

// // Retrieve card state from Realtime Database
// export const getCardState = async (id) => {
//   try {
//     if (!id) throw new Error("Invalid ID");
//     const cardRef = ref(db, `memes/${id}`);
//     const snapshot = await get(cardRef);

//     if (snapshot.exists()) {
//       return snapshot.val();
//     } else {
//       console.log(`No state found for ID: ${id}`);
//       return { reactions: { laugh: 0, notFunny: 0 }, comments: [] };
//     }
//   } catch (error) {
//     console.error(`Error retrieving from Realtime Database (ID: ${id}):`, error);
//     throw error;
//   }
// };

// // Add a new meme to Realtime Database
// export const addMeme = async (meme) => {
//   try {
//     const memesRef = ref(db, "memes");
//     const newMemeRef = await push(memesRef, meme);
//     console.log(`Added new meme with ID: ${newMemeRef.key}`);
//     return newMemeRef.key; // Return the unique ID of the newly added meme
//   } catch (error) {
//     console.error("Error adding meme:", error);
//     throw error;
//   }
// };

// // Fetch all memes from Realtime Database
// export const fetchMemes = async () => {
//   try {
//     const memesRef = ref(db, "memes");
//     const snapshot = await get(memesRef);

//     if (snapshot.exists()) {
//       const memes = snapshot.val();
//       return Object.keys(memes).map((id) => ({ id, ...memes[id] }));
//     } else {
//       console.log("No memes found");
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching memes:", error);
//     throw error;
//   }
// };

// // Update a meme's state in Realtime Database
// export const updateMeme = async (id, updatedData) => {
//   try {
//     const memeRef = ref(db, `memes/${id}`);
//     await update(memeRef, updatedData);
//     console.log(`Updated meme with ID: ${id}`);
//   } catch (error) {
//     console.error(`Error updating meme (ID: ${id}):`, error);
//     throw error;
//   }
// };

// // Get a specific meme by ID from Realtime Database
// export const getMemeById = async (id) => {
//   try {
//     const memeRef = ref(db, `memes/${id}`);
//     const snapshot = await get(memeRef);

//     if (snapshot.exists()) {
//       return snapshot.val();
//     }
//     console.log(`No meme found with ID: ${id}`);
//     return null;
//   } catch (error) {
//     console.error(`Error fetching meme by ID (ID: ${id}):`, error);
//     throw error;
//   }
// };

import { getDatabase, ref, get, set, update, child } from "firebase/database";
import { db } from "../firebase"; // Import the initialized Firebase Realtime Database instance

// Save MemeCard state (reactions and comments) to Realtime Database
export const saveCardState = async (id, state) => {
  try {
    if (!id || !state) throw new Error("Invalid ID or state");
    const stateRef = ref(db, `memeStates/${id}`); // Save only the state under `memeStates`
    await set(stateRef, state);
    console.log(`Saved MemeCard state (ID: ${id}):`, state);
  } catch (error) {
    console.error(`Error saving MemeCard state (ID: ${id}):`, error);
    throw error;
  }
};

// Retrieve MemeCard state (reactions and comments) from Realtime Database
export const getCardState = async (id) => {
  try {
    if (!id) throw new Error("Invalid ID");
    const stateRef = ref(db, `memeStates/${id}`);
    const snapshot = await get(stateRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log(`No state found for MemeCard (ID: ${id})`);
      return { reactions: { laugh: 0, notFunny: 0 }, comments: [] }; // Default state
    }
  } catch (error) {
    console.error(`Error retrieving MemeCard state (ID: ${id}):`, error);
    throw error;
  }
};

// Update MemeCard state (e.g., reactions or comments)
export const updateCardState = async (id, updates) => {
  try {
    if (!id || !updates) throw new Error("Invalid ID or updates");
    const stateRef = ref(db, `memeStates/${id}`);
    await update(stateRef, updates);
    console.log(`Updated MemeCard state (ID: ${id}):`, updates);
  } catch (error) {
    console.error(`Error updating MemeCard state (ID: ${id}):`, error);
    throw error;
  }
};
