import { create } from 'zustand';
import { DATABASE_ID, COLLECTION_ID_PETS, database, STORAGE_ID, storage } from '../appwriteConfig';
import { ID, Query } from 'appwrite';

import { toast, Bounce } from 'react-toastify';

const usePetsStore = create((set) => ({
  pets: [],
  loading: false,

  // fetch pets from the server
  fetchPets: async (OwnerID) => {
    if (!OwnerID) {
      console.error("OwnerID is undefined or null");
      set({ loading: false });
      return;
    }
    set({ loading: true });
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_PETS, [Query.equal("OwnerID", OwnerID)]);
      set({ pets: response?.documents || [], loading: false });
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error("Error fetching pets", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
      set({ loading: false });
    }

  },

  // Action: Add a new pet
  createPet: async (petData, userID, file) => {
    set({ loading: true });

    try {
      let imageUrl = "";

      //Upload image if a file is provided
      if (file) {
        const fileResponse = await storage.createFile(STORAGE_ID, ID.unique(), file);
        console.log("File Upload Response:", fileResponse);

        if (fileResponse?.$id) {
          const fileId = fileResponse.$id;
          imageUrl = storage.getFilePreview(STORAGE_ID, fileId);
        }
      }

      //Create the pet document with the uploaded image URL
      const newPet = {
        ...petData,
        OwnerID: userID,
        Pet_Image: imageUrl || null
      };

      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_PETS,
        ID.unique(),
        newPet
      );

      console.log("Pet created:", response);
      toast.success("Pet added!", { position: 'top-center', theme: 'colored', closeOnClick: true, transition: Flip, hideProgressBar: true, autoClose: 2000 });

      set((state) => ({
        pets: [...state.pets, response],
        loading: false,
      }));
    } catch (error) {
      console.error("Error creating pet:", error);
      toast.error("Error adding a new pet", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
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
      let fileId = null
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
      toast.error("Error deleting pet", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
      set({ loading: false });
    }
  },

}));


export default usePetsStore;
