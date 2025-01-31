import { create } from 'zustand';
import { DATABASE_ID, COLLECTION_ID_PETS, database } from '../appwriteConfig';


// Zustand store for managing pets
const usePetsStore = create((set) => ({
  pets: [], // State: List of pets
  loading: false,

    // fetch pets from the server
    fetchPets: async (OwnerID) => {
        set({ loading: true });
        try {
            const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_PETS);
            console.log('RESPONSE', response);
            set({ pets: response.documents, loading: false });
        }catch (error) {
            console.error('Error fetching pets:', error);
            set({ loading: false });
        }

    },

  // Action: Add a new pet
   // Action: Add a new pet
   createPet: async (petData, userID) => {
    set({ loading: true });
  
    try {
      const newPet = { ...petData, OwnerID: userID };
  
      // create a new document in appwrite
      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_PETS,
        'unique()', // You can use 'unique()' to auto-generate a unique ID
        newPet // This should be the data parameter
      );
      console.log('Pet created:', response);
  
      set((state) => ({
        pets: [...state.pets, response],
        loading: false,
      }));
    } catch (error) {
      console.error('Error creating pet:', error);
      set({ loading: false });
    }
  },

  // Action: Remove a pet by ID
  removePet: (id) =>
    set((state) => ({ pets: state.pets.filter((pet) => pet.id !== id) })),
}));

export default usePetsStore;
