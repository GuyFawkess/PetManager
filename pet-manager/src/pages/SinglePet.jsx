import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import usePetsStore from "../store/usePetsStore";
import { toast } from 'react-toastify';
import { Flip, Bounce } from 'react-toastify';

const SinglePet = () => {
    const { pets, fetchPets, loading, removePet } = usePetsStore();
    const { user } = useAuth();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const { id } = useParams();
    const [currentPet, setCurrentPet] = useState(null);
    const navigate = useNavigate();

    const randomNumber = Math.floor(Math.random() * 237)

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeDropdown);
        return () => document.removeEventListener("mousedown", closeDropdown);
    }, []);

    useEffect(() => {
        if (user) {
            fetchPets(user.$id);
        }
    }, [user]);

    useEffect(() => {
        if (pets.length > 0) {
            const foundPet = pets.find((pet) => pet.$id === id);
            setCurrentPet(foundPet || null);
        }
    }, [pets, id]);

    const handleDeleteClick = (pet) => {
        console.log("Deleting pet:", pet);
        setPetToDelete(pet);
    };

    const confirmDelete = async () => {
        try {
            console.log("Trying to delete", petToDelete.$id);
            await removePet(petToDelete.$id);
            fetchPets(user.$id);
            setPetToDelete(null);
            toast.warning("Pet Deleted!", { position: 'top-center', theme: 'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true });
            navigate('/pets'); // Redirect after deleting the pet
        } catch (error) {
            toast.error("Error deleting the pet", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce });
            console.error("Error deleting pet:", error);
        }
    };

    if (!currentPet) {
        return <p className="text-center text-lg mt-10">Pet not found or still loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-2xl">
                <div className="flex justify-between items-center">
                    <h1 className="mb-3 letrasLogo text-5xl text-amber-600 drop-shadow-[1px_1px_0.5px_black]">Meet {currentPet.Name}</h1>
                    
                    <div ref={dropdownRef} className="relative">
                        <button onClick={toggleDropdown} className="btn btn-circle swap swap-rotate">
                            {isOpen ? (
                                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                                    <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                                </svg>
                            ) : (
                                <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                                    <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                                </svg>
                            )}
                        </button>

                        {isOpen && (
                            <ul className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-40">
                                <li className="p-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                                <li className="p-2 hover:bg-red-600 text-red-600 hover:text-white cursor-pointer" onClick={() => handleDeleteClick(currentPet)}>Delete</li>
                            </ul>
                        )}
                    </div>
                </div>

                <div className="w-full flex flex-col items-center mt-6">
                    <img
                        src={currentPet.Pet_Image || `https://picsum.photos/id/${randomNumber}/300/400`}
                        alt={currentPet.Name}
                        className="w-40 h-40 object-cover rounded-full border-2 border-gray-300"
                    />
                </div>
                <p className="text-lg mt-4">This is the page of <span className="font-semibold">{currentPet.Name} the {currentPet.Type}</span></p>

                {petToDelete && (
                    <div className="mt-6 bg-gray-200 p-4 rounded-lg text-center">
                        <p>Are you sure you want to delete {petToDelete.Name}?</p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg" onClick={confirmDelete}>Confirm</button>
                            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={() => setPetToDelete(null)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePet;
