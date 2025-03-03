import { create } from 'zustand';
import { DATABASE_ID, COLLECTION_ID_EVENTS, database } from '../appwriteConfig';
import { ID, Query } from 'appwrite';

import { toast, Bounce } from 'react-toastify';

const useEventsStore = create((set) => ({
  events: [],
  loading: false,

  fetchEvents: async (OwnerID) => {
    set({ loading: true });

    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_EVENTS, [Query.equal("OwnerID", OwnerID)]);

      const formattedEvents = response.documents.map((doc) => ({
        id: doc.$id,
        start: new Date(doc.StartDate),
        end: new Date(doc.EndDate),
        title: doc.Title,
        pet: doc.PetName
      }))

      set({ events: formattedEvents, loading: false });

    } catch (error) {
      console.log('Error fetching events:', error);
      toast.error("Error Fetching the Events", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
      set({ loading: false });
    }
  },

  createEvent: async (eventData, userID) => {
    set({ loading: true });
    try {
      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_EVENTS,
        ID.unique(),
        eventData
      );

      const newEvent = {
        id: response.$id,
        start: new Date(response.StartDate),
        end: new Date(response.EndDate),
        title: response.Title,
        OwnerID: userID,
        pet: response.PetName
      };

      set((state) => ({
        events: [...state.events, newEvent],
        loading: false,
      }));
    } catch (error) {
      console.log('Error creating event:', error);
      toast.error("Error creating event", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
      set({ loading: false });
    }
  },

  updateEvent: async (eventID, updatedData) => {
    set({ loading: true });
    try {
      const response = await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID_EVENTS,
        eventID,
        updatedData
      );

      set((state) => ({
        events: state.events.map((event) =>
          event.id === eventID
            ? {
              ...event,
              title: response.Title,
              start: new Date(response.StartDate),
              end: new Date(response.EndDate),
              pet: response.PetName,
            }
            : event
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error("Error updating event", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
      console.error('Error updating event:', error);
      set({ loading: false });
    }
  },

  removeEvent: async (id) => {
    set({ loading: true });
    try {
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID_EVENTS, id);
      set((state) => ({
        events: state.events.filter((event) => event.$id !== id),
        loading: false,
      }));
    } catch (error) {
      toast.error("Error deleting event", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
      console.log('Error removing event:', error);
      set({ loading: false });
    }
  },
}));

export default useEventsStore;
