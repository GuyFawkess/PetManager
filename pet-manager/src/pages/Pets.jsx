import React, { useState, useEffect } from "react";
import usePetsStore from "../store/usePetsStore";
import AddPetModal from "../components/AddPetModal";
import { useAuth } from "../store/AuthContext";
import { Link } from 'react-router-dom'

const Pets = () => {
  const { pets, fetchPets, loading } = usePetsStore();
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPets(user.$id);
    }
  }, [user]);

  const randomNumber = Math.floor(Math.random() * 237)

  return (
    <main className="min-h-full bg-[url('/src/assets/undraw_friends_xscy.svg')] 
    bg-no-repeat bg-[length:40%] bg-[position:right_center]">
      <div className="container mx-auto p-4 text-2xl max-w-9/12">
        <h1 className="mb-3 letrasLogo text-5xl text-amber-600 drop-shadow-[1px_1px_0.5px_black]">
          My Pets
        </h1>
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
                    className="min-h-50 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{pet.Name}</h2>
                  <p>Type: {pet.Type}</p>
                  <div className="card-actions justify-end">
                    <Link className="btn btn-warning" to={`/singlepet/${pet.$id}`}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )
        }
        <button className="btn btn-warning mt-2" onClick={() => setShowAddPetModal(true)}>Add Pet</button>
        {showAddPetModal && <AddPetModal closeModal={() => setShowAddPetModal(false)} />}
      </div>
    </main>
  );
};

export default Pets;
