import React, { useState, useEffect, useRef } from "react";
import usePetsStore from "../store/usePetsStore";
import { useAuth } from "../store/AuthContext";
import ConfirmationModal from '../components/ConfirmationModal';
import { toast, Flip, Bounce } from "react-toastify";


const PetViewModal = ({ closeModal, pet }) => {
    const { pets, fetchPets, loading, removePet } = usePetsStore();
    const { user } = useAuth();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);


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


    const closeModalBgClick = (e) => {
        if (e.target.id === "modal-bg") {
            closeModal();
        }
    }

    const handleDeleteClick = (pet) => {
        console.log("Deleting pet:", pet)
        setPetToDelete(pet);
        setIsConfirmVisible(true);
    };

    const confirmDelete = async () => {
        try {
            console.log("Trying to delete", petToDelete.$id)
            await removePet(petToDelete.$id)
            fetchPets(user.$id); // Fetch the updated events list
            setPetToDelete(null);
            setIsConfirmVisible(false);
            closeModal()
            toast.warning("Pet Deleted!", {position:'top-center', theme:'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true})
        } catch (error) {
            toast.error("Error deleting the pet", {position:'top-center', hideProgressBar: true, theme:'colored', closeOnClick: true, transition: Bounce})
            console.error("Error deleting event:", error);
        }
    }

    return (
        <div id="modal-bg" className="fixed inset-0 min-h-screen bg-zinc-700/50 flex justify-center items-center" onClick={closeModalBgClick}>
            <div className="bg-gray-50 p-4 m-4 rounded-lg w-10/12 max-w-screen-md md:w-7/12 shadow-2xl relative">
                {/* <a onClick={closeModal} className="absolute right-5 text-2xl hover:cursor-pointer">X</a> */}
                <div ref={dropdownRef} className="dropdown dropdown-right absolute right-5">
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

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <ul className="menu dropdown-content bg-base-100 rounded-box w-52 p-2 shadow-sm absolute right-0 top-full mt-2">
                            <li><a>Edit</a></li>
                            <li>
                                <button onClick={() => handleDeleteClick(pet)} className="hover:bg-red-700 hover:text-white">Delete</button>
                            </li>
                        </ul>
                    )}
                </div>
                <h1 className="text-4xl py-8 font-bold text-center">Vista detallada de {pet.Name}</h1>
                <div className="bg-orange-400 w-4/6 h-1 mx-auto mb-8"></div>

            </div>
            <ConfirmationModal
                show={isConfirmVisible}
                onConfirm={confirmDelete}
                onCancel={closeModal}
                message={`Are you sure you want to delete "${pet.Name}"?`}
            />
        </div>
    );

}

export default PetViewModal;