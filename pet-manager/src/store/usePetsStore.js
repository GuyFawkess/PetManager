import { create } from 'zustand';
import { DATABASE_ID, COLLECTION_ID_PETS, database, PROJECT_ID, STORAGE_ID, storage } from '../appwriteConfig';
import { ID, Query } from 'appwrite';


// Zustand store for managing pets
const usePetsStore = create((set) => ({
  pets: [], // State: List of pets
  loading: false,

  // fetch pets from the server
  fetchPets: async (OwnerID) => {
    set({ loading: true });
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_PETS, [Query.equal("OwnerID", OwnerID)]);
      console.log('RESPONSE', response);
      set({ pets: response.documents, loading: false });
    } catch (error) {
      console.error('Error fetching pets:', error);
      set({ loading: false });
    }

  },

  // Action: Add a new pet
  createPet: async (petData, userID, file) => {
    set({ loading: true });
  
    try {
      let imageUrl = ""; // Default empty image
  
      // Step 1: Upload image if a file is provided
      if (file) {
        const fileResponse = await storage.createFile(STORAGE_ID, ID.unique(), file);
        console.log("File Upload Response:", fileResponse);
  
        if (fileResponse && fileResponse.$id) {
          const fileId = fileResponse.$id;
          imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${STORAGE_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
        }
      }
  
      // Step 2: Create the pet document with the uploaded image URL
      const newPet = { ...petData, OwnerID: userID, Pet_Image: imageUrl };
  
      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_PETS,
        ID.unique(),
        newPet
      );
  
      console.log("Pet created:", response);
  
      set((state) => ({
        pets: [...state.pets, response],
        loading: false,
      }));
    } catch (error) {
      console.error("Error creating pet:", error);
      set({ loading: false });
    }
  },
  

  // Action: Remove a pet by ID
  removePet: async (id) => {
    set({ loading: true });
  
    try {
      const pet = await database.getDocument(DATABASE_ID, COLLECTION_ID_PETS, id);
  
      // Extract file ID from Pet_Image URL
      const imageUrl = pet.Pet_Image;
      const fileId = null
      if (imageUrl) {
        const fileIdMatch = imageUrl.match(/files\/(.*?)\//);
        fileId = fileIdMatch ? fileIdMatch[1] : null;
    }
      // Delete pet document
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID_PETS, id);
  
      // Delete image if fileId was extracted
      if (fileId) {
        await storage.deleteFile(STORAGE_ID, fileId);
        console.log(`Image ${fileId} deleted successfully.`);
      }
  
      // Update state
      set((state) => ({
        pets: state.pets.filter((pet) => pet.$id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error("Error removing pet:", error);
      set({ loading: false });
    }
  },
  
}));


export default usePetsStore;
