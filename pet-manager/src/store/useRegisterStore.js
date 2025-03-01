import { create } from "zustand";
import { DATABASE_ID, COLLECTION_ID_REGISTER, database } from "../appwriteConfig";
import { ID, Query } from "appwrite";

import { toast, Bounce, Flip } from 'react-toastify';

export const useRegisterStore = create((set) => ({
    registerData: [],
    loading: false,

    fetchRegisterData: async (PetID) => {
        if (!PetID) {
            console.error("PetId is undefined or null");
            set({ loading: false });
            return;
        }
        set({ loading: true });
        try {
            const response = await database.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_REGISTER,
                [
                    Query.equal("PetID", PetID),
                    Query.orderDesc("$createdAt"),
                    Query.limit(5),
                ]
            );

            set({ registerData: response?.documents || [], loading: false });
        } catch (error) {
            toast.error("Error fetching register", {
                position: 'top-center',
                hideProgressBar: true,
                theme: 'colored',
                closeOnClick: true,
                transition: Bounce,
            });
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
                    [PetID]: [response, ...(state.registerData[PetID] || [])].slice(0, 3), // Only keep the last 3 entries
                },
            }));
            toast.success("Register added!", { position: 'top-center', theme: 'colored', closeOnClick: true, transition: Flip, hideProgressBar: true, autoClose: 2000 });
            set({ loading: false });
        } catch (error) {
            console.error("Error adding register entry:", error);
            toast.error("Error adding a new register", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
            set({ loading: false });
        }
    },

    deleteRegisterEntry: async (registerID) => {
        set({ loading: true })
        try {
            const register = await database.getDocument(DATABASE_ID, COLLECTION_ID_REGISTER, registerID)
            await database.deleteDocument(DATABASE_ID, COLLECTION_ID_REGISTER, registerID)
            set((state) => ({
                registerData: state.registerData.filter((register) => register.$id !== registerID),
                loading: false,
              }));
            console.log("Deleted register:", registerID)
        }
        catch (error) {
            console.error("Error removing register:", error);
            toast.error("Error deleting register", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
            set({ loading: false });
        }
    }

}))