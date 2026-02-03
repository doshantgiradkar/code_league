import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot,
  collectionGroup,
  arrayUnion, 
  arrayRemove,
  setDoc
} from "firebase/firestore";
import {auth,db,app,storage} from './firebaseConfig'
import { supabase } from "./supabaseConfig";


/**
 * Adds a document to a specified collection.
 * @param {string} collectionName - The collection where the document will be added.
 * @param {Object} data - The data to store in the document.
 * @returns {string} The ID of the newly created document.
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

/**
 * Creates or updates a document at a specific path.
 *
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The document ID to create or update.
 * @param {Object} data - The data to store in the document.
 * @param {Object} [options] - Optional Firestore setDoc options.
 * @param {boolean} [options.merge=true] - Whether to merge with existing data.
 *
 * @returns {Promise<string>} - Returns the document ID.
 */
export const setDocument = async (
  collectionName,
  docId,
  data,
  options = { merge: true }
) => {
  try {
    const docRef = doc(db, collectionName, docId);

    await setDoc(docRef, data, options);

    console.log(
      `Document successfully set: ${collectionName}/${docId}`
    );

    return docId;
  } catch (error) {
    console.error(
      `Error setting document ${collectionName}/${docId}:`,
      error
    );
    throw error;
  }
};

/**
 * Retrieves a document from a specified collection by ID.
 * @param {string} collectionName - The collection name.
 * @param {string} docId - The document ID.
 * @returns {Object|null} The document data if it exists, otherwise null.
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

/**
 * Updates a document in a specified collection.
 * @param {string} collectionName - The collection name.
 * @param {string} docId - The document ID.
 * @param {Object} data - The new data to update.
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

/**
 * Deletes a document from a specified collection.
 * @param {string} collectionName - The collection name.
 * @param {string} docId - The document ID.
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

/**
 * Retrieves all documents from a specified collection.
 * @param {string} collectionName - The collection name.
 * @returns {Array} Array of document objects.
 */
export const getCollectionDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return docs;
  } catch (error) {
    console.error("Error getting collection documents:", error);
    throw error;
  }
};

/**
 * Queries documents from a collection using provided constraints.
 * @param {string} collectionName - The collection name.
 * @param {Array} constraints - An array of query constraints (e.g., where clauses).
 * @returns {Array} Array of document objects matching the query.
 */
export const getDocumentsByQuery = async (collectionName, constraints) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents by query:", error);
    throw error;
  }
};

/**
 * Sets up a real-time listener for a collection.
 * @param {string} collectionName - The collection name.
 * @param {Function} callback - Callback function to execute with the updated data.
 * @returns {Function} Unsubscribe function to stop listening.
 */
export const onCollectionUpdate = (collectionName, callback) => {
  return onSnapshot(collection(db, collectionName), (querySnapshot) => {
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(docs);
  }, (error) => {
    console.error("Error on collection snapshot:", error);
  });
};

/**
 * Sets up a real-time listener for a specific document.
 * @param {string} collectionName - The collection name.
 * @param {string} docId - The document ID.
 * @param {Function} callback - Callback function to execute with the updated document data.
 * @returns {Function} Unsubscribe function to stop listening.
 */
export const onDocumentUpdate = (collectionName, docId, callback) => {
  return onSnapshot(doc(db, collectionName, docId), (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback({ id: docSnapshot.id, ...docSnapshot.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error on document snapshot:", error);
  });
};

/**
 * Sets up a realtime listener for a subcollection with optional query constraints
 *
 * @param {string[]} parentPathArray - e.g. ["chats", "chatId123"]
 * @param {string} subcollectionName - e.g. "messages"
 * @param {Array} constraints - Firestore query constraints (orderBy, where, etc.)
 * @param {Function} callback - Receives updated docs
 * @returns {Function} unsubscribe
 */
export const onSubcollectionUpdate = (
  parentPathArray,
  subcollectionName,
  constraints = [],
  callback
) => {
  try {
    const ref = collection(db, ...parentPathArray, subcollectionName);
    const q = constraints.length ? query(ref, ...constraints) : ref;

    return onSnapshot(
      q,
      (snapshot) => {
        callback(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => {
        console.error("Subcollection snapshot error:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up subcollection listener:", error);
    throw error;
  }
};


/**
 * Adds a document to a subcollection of a parent document.
 * @param {string} parentCollection - The name of the parent collection.
 * @param {string} parentDocId - The ID of the parent document.
 * @param {string} subCollection - The name of the subcollection.
 * @param {Object} data - The data to store in the subcollection document.
 * @returns {Promise<string>} The ID of the newly created subdocument.
 */
export const addSubCollectionDocument = async (parentPathArray, subCollectionName, data) => {
    try {
      // Get a reference to the subcollection under the parent document
      const subCollectionRef = collection(db, ...parentPathArray, subCollectionName);
      // Add the document to the subcollection
      const docRef = await addDoc(subCollectionRef, data);
      console.log("Subdocument written with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding subdocument:", error);
      throw error;
    }
  };

  /**
 * Deletes a document from a subcollection under a parent document.
 *
 * @param {string[]} parentPathArray - An array representing the parent document path.
 *                                     E.g., ["users", "userID123"]
 * @param {string} subCollectionName - The name of the subcollection (e.g., "posts").
 * @param {string} docId - The ID of the document to delete within the subcollection.
 * @returns {Promise<string>} - The ID of the deleted document.
 */
export const deleteSubCollectionDocument = async (parentPathArray, subCollectionName, docId) => {
    try {
      // Get a reference to the document in the subcollection
      const docRef = doc(db, ...parentPathArray, subCollectionName, docId);
      // Delete the document
      await deleteDoc(docRef);
      console.log("Subdocument deleted successfully:", docId);
      return docId;
    } catch (error) {
      console.error("Error deleting subdocument:", error);
      throw error;
    }
  };

  /**
 * Updates a document in a subcollection under a parent document.
 *
 * @param {string[]} parentPathArray - An array representing the parent document path.
 *                                     For example: ["users", "userID123"]
 * @param {string} subCollectionName - The name of the subcollection (e.g., "posts").
 * @param {string} docId - The ID of the document to update in the subcollection.
 * @param {Object} data - The new data to update in the document.
 * @returns {Promise<string>} - Returns the ID of the updated subdocument.
 */
export const updateSubCollectionDocument = async (parentPathArray, subCollectionName, docId, data) => {
    try {
      // Build a reference to the document within the subcollection
      const docRef = doc(db, ...parentPathArray, subCollectionName, docId);
      // Update the document with the provided data
      await updateDoc(docRef, data);
      console.log("Subdocument updated successfully:", docId);
      return docId;
    } catch (error) {
      console.error("Error updating subdocument:", error);
      throw error;
    }
  };

  /**
 * Retrieves all documents from a subcollection of a specified parent document.
 *
 * @param {string[]} parentPathArray - An array representing the parent document path.
 *                                      For example: ['users', 'userID123']
 * @param {string} subcollectionName - The name of the subcollection (e.g., "posts").
 * @returns {Promise<Array>} - A promise that resolves to an array of documents.
 */
export const getSubcollectionDocs = async (parentPathArray, subcollectionName) => {
    try {
      // Construct the full path for the subcollection
      const subcollectionRef = collection(db, ...parentPathArray, subcollectionName);
      
      // Get documents from the subcollection
      const querySnapshot = await getDocs(subcollectionRef);
      
      // Map through the documents and return their data along with document ID
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return docs;
    } catch (error) {
      console.error("Error fetching subcollection docs:", error);
      throw error;
    }
  };

  /**
 * Retrieves all documents from a given subcollection across Firestore.
 * @param {string} subcollectionName - The name of the subcollection to query.
 * @returns {Promise<Array>} An array of document objects with their IDs.
 */
export const getAllSubcollectionDocs = async (subcollectionName) => {
    try {
      // Create a collection group query for the provided subcollection name
      const subcollectionQuery = collectionGroup(db, subcollectionName);
      const querySnapshot = await getDocs(subcollectionQuery);
      // Map through each document and return its id and data
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return docs;
    } catch (error) {
      console.error(`Error fetching documents from subcollection "${subcollectionName}":`, error);
      throw error;
    }
  };


/**
 * Adds a value to an array field of a document.
 * Uses Firestore's atomic arrayUnion to avoid duplicates and ensure concurrency safety.
 * 
 * @param {string} collectionName - The name of the collection containing the document.
 * @param {string} docId - The ID of the document to update.
 * @param {string} fieldName - The name of the array field to update.
 * @param {*} value - The value to add to the array.
 */
export const addToArrayField = async (collectionName, docId, fieldName, value) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      [fieldName]: arrayUnion(value)
    });
    console.log(`Added value to ${fieldName} in ${collectionName}/${docId}`);
  } catch (error) {
    console.error(`Error adding value to array field "${fieldName}" in document "${docId}":`, error);
    throw error;
  }
};

/**
 * Removes a value from an array field of a document.
 * Uses Firestore's atomic arrayRemove to ensure concurrency safety.
 * 
 * @param {string} collectionName - The name of the collection containing the document.
 * @param {string} docId - The ID of the document to update.
 * @param {string} fieldName - The name of the array field to update.
 * @param {*} value - The value to remove from the array.
 */
export const removeFromArrayField = async (collectionName, docId, fieldName, value) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      [fieldName]: arrayRemove(value)
    });
    console.log(`Removed value from ${fieldName} in ${collectionName}/${docId}`);
  } catch (error) {
    console.error(`Error removing value from array field "${fieldName}" in document "${docId}":`, error);
    throw error;
  }
};


/**
 * Upload a file to Supabase Storage
 * @param {Object} params
 * @param {File} params.file - File object
 * @param {string} params.bucket - Bucket name
 * @param {string} params.userId - User ID
 * @param {string} params.folder - Optional folder (resume, certificates, etc.)
 * @param {boolean} params.upsert - Replace file if exists
 */
export const uploadFile = async ({
  file,
  bucket,
  userId,
  folder = "",
  upsert = false,
}) => {
  if (!file || !bucket || !userId) {
    throw new Error("Missing required parameters");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${folder}/${fileName}`.replace("//", "/");

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert,
    });

  if (error) throw error;

  return {
    path: data.path,
    fileName,
  };
};


/**
 * Delete a file from Supabase Storage
 * @param {Object} params
 * @param {string} params.bucket - Bucket name
 * @param {string} params.filePath - Full file path
 */
export const deleteFile = async ({ bucket, filePath }) => {
  if (!bucket || !filePath) {
    throw new Error("Missing required parameters");
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) throw error;

  return true;
};
