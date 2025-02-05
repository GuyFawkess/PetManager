import React, { useState, useEffect } from "react";
import usePetsStore from "../store/usePetsStore";
import AddPetModal from "../components/AddPetModal";
import Button from "../components/Button"; // Assuming you have the reusable Button component
import { Link } from "react-router-dom";

const Home = () => {
  const { pets, fetchPets, loading } = usePetsStore();

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Pet Manager!</h1>
      
      <Link to="/calendar">See calendar</Link>

      {/* Add Pet Modal */}
      <div className="mb-4">
        <AddPetModal />
      </div>

      {/* Pet List */}
      {loading ? (
        <p>Loading pets...</p>
      ) : (
        <ul className="list-disc pl-6">
          {pets.map((pet) => (
            <li key={pet.$id}>
              {pet.Name} - {pet.Type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
