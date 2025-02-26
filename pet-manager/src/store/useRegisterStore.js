import { create } from "zustand";
import { DATABASE_ID, COLLECTION_ID_REGISTER, database } from "../appwriteConfig";
import { ID, Query } from "appwrite";

export const useRegisterStore = create((set) => ({
    registerData: {},
    loading: false,

    fetchRegisterData: async (PetID) => {
        if (!PetID) {
            console.error("PetId is undefined or null");
            set({ loading: false });
            return;
          }
        set({ loading: true });
        try {
            const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_REGISTER,  [
                Query.equal("PetID", PetID),
            ]);
            set({ registerData: response?.documents || [], loading: false });
            console.log("Register Data:", response?.documents);
        } catch (error) {
            console.error("Error fetching register data:", error);
            set({ loading: false });
        }

    },

    addRegisterEntry: async (PetID, newEntry) => {
        set({ loading: true });
        try {
            const response = await database.createDocument(DATABASE_ID, COLLECTION_ID_REGISTER, ID.unique(), { ...newEntry, PetID });
            set((state) => ({
                registerData: {
                    ...state.registerData,
                    [PetID]: [document, ...(state.registerData[PetID] || [])].slice(0, 3), // Only keep the last 3 entries
                },
            }));
        } catch (error) {
            console.error("Error adding register entry:", error);
            set({ loading: false });
        }
    },

    getLastThreeRecords: (field, PetID) => {
        return (registerData[PetID] || []).map((entry) => entry[field]).slice(0, 3);
    }


}))