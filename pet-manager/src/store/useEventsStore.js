import { create } from 'zustand';

// Zustand store for managing events
const useEventsStore = create((set) => ({
  events: [], // State: List of events
  loading: false,

  // Action: Set all events
  setEvents: (events) => set({ events }),

  // Action: Add a new event
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),

  // Action: Remove an event by ID
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((ev) => ev.id !== id),
    })),
}));

export default useEventsStore;
