import React, { useState } from "react";
import usePetsStore from "../store/usePetsStore";
import { useAuth } from "../store/AuthContext";

import { toast, Flip } from "react-toastify";

const AddPetModal = ({ closeModal }) => {
  const { createPet } = usePetsStore();
  const { user } = useAuth();
  const [petData, setPetData] = useState({ Name: "", Type: "", Pet_Image: "", birth_date: "", breed_species: "" });
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the file for later use
    }
  }; 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createPet(petData, user.$id, selectedFile);
    setPetData({ Name: "", Type: "", Pet_Image: "", birth_date: "", breed_species: "" });
    setSelectedFile(null);
    setLoading(false);
    closeModal();
  };

  const closeModalBgClick = (e) => {
    if (e.target.id === "modal-bg") {
      closeModal();
    }
  };


  return (
    <div id="modal-bg" className="fixed inset-0 min-h-screen bg-zinc-700/50 flex justify-center items-center" onClick={closeModalBgClick}>
      <div className="bg-gray-50 p-4 m-4 rounded-lg w-10/12 max-w-screen-md md:w-7/12 shadow-2xl relative">
        <a onClick={closeModal} className="absolute right-5 text-2xl hover:cursor-pointer">X</a>
        <h1 className="text-4xl py-8 font-bold text-center">Add a new pet!
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
              <svg
                tabIndex={0}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div
              tabIndex={0}
              className="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-64 shadow-sm">
              <div tabIndex={0} className="card-body">
                <h2 className="card-title">This information will not be able to be edited,</h2>
                <p>No se si ponerlo aqui arriba o al lado del botom de add pet pero esque se veia un poco feo, pero es un bonito detalle ya mirare donde ponerlo :)</p>
              </div>
            </div>
          </div>
        </h1>
        <div className="bg-orange-400 w-4/6 h-1 mx-auto mb-8"></div>
        <form className="px-4 my-3 max-w-3xl mx-auto space-y-3 flex flex-wrap gap-x-7" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">What type of pet:</legend>
            <select name="Type"
              value={petData.Type}
              onChange={handleInputChange}
              required className="select">
              <option disabled={true}>Select type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Ferret">Ferret</option>
              <option value="Bird">Bird</option>
              <option value="Rodent/Bunny">Rodent/Bunny</option>
              <option value="Turtle/Lizard/Amphibian">Turtle/Lizard/Amphibian</option>
              <option value="Snake">Snake</option>
              <option value="Fish">Fish</option>
              <option value="Invertebrate">Invertebrate</option>
            </select>
            <span className="fieldset-label">Optional</span>
            {/* borrar esta linea de arriba */}
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">What is your pet's breed or species?</legend>
            <input type="text" name="breed_species" value={petData.breed_species} onChange={handleInputChange} className="input" placeholder="Type here" required />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Photo of your pet:</legend>
            <input type="file" id="uploader" accept="image/*" onChange={handleFileChange} className="file-input" />
            <label className="fieldset-label">Max size 30MB</label>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Age of your pet:</legend>
            <input type="date" name="birth_date" value={petData.birth_date} className="input" onChange={handleInputChange} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">What is your pet's name?</legend>
            <input type="text" name="Name" value={petData.Name} onChange={handleInputChange} className="input" placeholder="Type here" required />
          </fieldset>

          <div className="mx-0 my-[1em]">
            <button type="submit"
              className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative">{loading ? "Adding..." : "Add Pet"}</span>
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;