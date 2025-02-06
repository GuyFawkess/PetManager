import React, { useState, useEffect } from "react";
import usePetsStore from "../store/usePetsStore";
import AddPetModal from "../components/AddPetModal";
import Button from "../components/Button"; 
import { useAuth } from "../store/AuthContext";

const Home = () => {
  const { pets, fetchPets, loading } = usePetsStore();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const opneModal = () => {
    console.log("Opening modal");
    setShowModal(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setShowModal(false);
  }

  useEffect(() => {
    if (user) {
      fetchPets(user.$id);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4 text-2xl">
      <h1 className="font-bold mb-4 text-3xl text-red-500">Welcome to Pet Manager!</h1>
      {/* Pet List */}
      {loading ? (
        <p>Loading pets...</p>
      ) : (
        <ul className="list-disc pl-6">
          {pets.map((pet) => (
            <li key={pet.$id} className="p-2 mb-2">
              {pet.Name} - {pet.Type}
            </li>
          ))}
        </ul>
      )}
      <Button handleClick={opneModal} text="Add Pet" />
      {showModal && <AddPetModal closeModal={closeModal}/>}
    </div>
  );
};

export default Home;
