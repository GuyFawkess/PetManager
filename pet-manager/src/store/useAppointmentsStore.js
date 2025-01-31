import { create } from 'zustand';

// Zustand store for managing appointments
const useAppointmentsStore = create((set) => ({
  appointments: [], // State: List of appointments

  // Action: Set all appointments
  setAppointments: (appointments) => set({ appointments }),

  // Action: Add a new appointment
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),

  // Action: Remove an appointment by ID
  removeAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((appt) => appt.id !== id),
    })),
}));

export default useAppointmentsStore;
