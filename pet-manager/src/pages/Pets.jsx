import React, { useState, useEffect } from "react";
import usePetsStore from "../store/usePetsStore";
import AddPetModal from "../components/AddPetModal";
import Button from "../components/Button";
import { useAuth } from "../store/AuthContext";

const Pets = () => {
  const { pets, fetchPets, loading, removePet } = usePetsStore();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const openModal = () => {
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

  const randomNumber = Math.floor(Math.random() * 237)

  return (
    <main className="bg-[url('/src/assets/undraw_friends_xscy.svg')] 
    bg-no-repeat bg-[length:40%] bg-[position:right_center] min-h-fit">
    <div className="container mx-auto p-4 text-2xl max-w-9/12">
      <h1 className="font-bold mb-4 text-3xl text-red-500">Welcome {user.name}</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-5">
          {pets.map((pet) => (
            <div key={pet.$id} className="card bg-base-100 w-70 h-90 shadow-md">
              <figure>
                <img
                  src={pet.Pet_Image || `https://picsum.photos/id/${randomNumber}/300/400`}
                  alt={pet.Name}
                  className="h-auto w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{pet.Name}</h2>
                <p>Type: {pet.Type}</p>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => removePet(pet.$id)}
                    className="btn btn-error "
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      )
      }
      <Button handleClick={openModal} text="Add Pet" />
      {showModal && <AddPetModal closeModal={closeModal} />}
    </div>
    </main>
  );
};

export default Pets;
