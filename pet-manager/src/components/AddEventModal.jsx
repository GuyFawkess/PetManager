import React, { useState, useEffect } from "react";
import useEventsStore from "../store/useEventsStore";
import usePetsStore from "../store/usePetsStore";
import { useAuth } from "../store/AuthContext";

const AddEventModal = ({ closeModal }) => {

    const { createEvent } = useEventsStore();
    const { pets, fetchPets, loading } = usePetsStore();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        start: '',
        end: '',
        pet: '',
        petID: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "pet") {
          const selectedPet = pets.find(pet => pet.Name === value);
          setFormData((prev) => ({ ...prev, petID: selectedPet ? selectedPet.$id : '' }));
        }
      };

      const handleFormSubmit = (e) => {
        e.preventDefault();

    
        // Validate form fields
        if (!formData.title || !formData.start || !formData.end) {
          alert('Please fill all the fields');
          return;
        }
    
        // Validate date inputs
        const startDate = new Date(formData.start);
        const endDate = new Date(formData.end);
    
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          alert('Invalid date format. Please check the start and end dates.');
          return;
        }
    
        // Create new event
        const newEvent = {
          Title: formData.title,
          StartDate: startDate.toISOString(),
          EndDate: endDate.toISOString(),
          OwnerID: user.$id,
          PetID: formData.petID,
          PetName: formData.pet
        };
    
        createEvent(newEvent); 
        setFormData({ title: '', start: '', end: '', pet: '', petID: '' });
        closeModal();
      };

      const closeModalBgClick = (e) => {
        if (e.target.id === "modal-bg-event") {
          closeModal();
        }
    
      }

      useEffect(() => {
          if (user) {
            fetchPets(user.$id);
          }
        }, [user]);
    
    return (
        <div id="modal-bg-event" className="fixed inset-0 min-h-screen bg-zinc-700/50 flex justify-center items-center z-[1000]" onClick={closeModalBgClick}>
            <div className="bg-gray-50 p-4 m-4 rounded-lg w-10/12 max-w-screen-md md:w-7/12 shadow-2xl relative">
            <a onClick={closeModal} className="absolute right-5 text-2xl hover:cursor-pointer">X</a>
            <h1 className=" text-center text-4xl py-8 font-bold">Add an Event</h1>
            <div className="bg-orange-400 w-5/12 h-1 mx-auto mb-8"></div>
            <form onSubmit={handleFormSubmit} className="mb-4 bg-white p-4 rounded shadow">
          <div className="mb-4">
            <label className="block font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              placeholder="Event Title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Start Date & Time</label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">End Date & Time</label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <label className="block font-bold mb-2">Pet</label>
          <select
            name="pet"
            value={formData.pet}
            onChange={handleInputChange}
            required
            className="m-4 p-2 border-2 border-gray-300 rounded-md w-1/2"
          >
            <option value="General">Evento general</option>
            {pets.map((pet) => (
              <option key={pet.$id} value={pet.Name}>
                {pet.Name}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Add Event
          </button>
        </form>
      
            </div>
        </div>
    )


}


export default AddEventModal;