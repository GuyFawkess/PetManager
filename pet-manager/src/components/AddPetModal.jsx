import React, { useState } from "react";
import usePetsStore from "../store/usePetsStore";
import { useAuth } from "../store/AuthContext";


const AddPetModal = () => {
  const { createPet } = usePetsStore(); // Use createPet instead of addPet
  const { user } = useAuth(); // Assuming user object has ID
  const [petData, setPetData] = useState({ Name: "", Type: ""});

  const handleInputChange = (e) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to add a pet.");

    await createPet(petData, user.$id); // Use createPet here
    setPetData({ Name: "", Type: ""}); // Reset form
  };

  return (
    <div>
      {/* Trigger */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Pet</button>

      {/* Modal */}
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="Name"
            placeholder="Pet Name"
            value={petData.Name}
            onChange={handleInputChange}
            required
          />
          <select
            name="Type"
            value={petData.Type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
          </select>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Save Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;
