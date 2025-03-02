import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import usePetsStore from "../store/usePetsStore";
import useEventsStore from "../store/useEventsStore";
import dayjs from "dayjs";
import { useRegisterStore } from '../store/useRegisterStore';
import { toast } from 'react-toastify';
import { Flip, Bounce } from 'react-toastify';
import RegisterFormModal from '../components/RegisterFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AddEventModal from "../components/AddEventModal";


const SinglePet = () => {
    const { pets, fetchPets, removePet, loading } = usePetsStore();
    const { fetchRegisterData, registerData, deleteRegisterEntry } = useRegisterStore();
    const { events, fetchEvents, removeEvent } = useEventsStore();
    const { user } = useAuth();
    // const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPetConfirmVisible, setIsPetConfirmVisible] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const { id } = useParams();
    const [currentPet, setCurrentPet] = useState(null);
    const navigate = useNavigate();
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showRegister, setShowRegister] = useState(false);
    const [isEventConfirmVisible, setIsEventConfirmVisible] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isRegisterConfirmVisible, setIsRegisterConfirmVisible] = useState(false);
    const [registerToDelete, setRegisterToDelete] = useState(null);

    const randomNumber = Math.floor(Math.random() * 237)


    useEffect(() => {
        if (user) {
            fetchPets(user.$id);
            fetchRegisterData(id)
            fetchEvents(user.$id);
        }
    }, [user, showRegister ]);
    // EESTA BUSCANDO LAS MASCOTAS POR NOMBRE EN VEZ DE ID PORQUE EL EVENTO NO GUARDA EL PETID SINO EL NOMBRE ESTARIA BIEN CAMBIARLO PERO PARA EL FUTURO, TE DEJO ESTE COMENTARIO PARA QUE LO SEPAS(PASA LO MISMO EN EL HOME)
    useEffect(() => {
        if (currentPet) {
            const updatedEvents = events
                .filter(event => event.pet === currentPet.Name) // Filtrar por nombre en lugar de ID
                .sort((a, b) => new Date(a.start) - new Date(b.start));

            setFilteredEvents(updatedEvents);
        }
    }, [events, currentPet]);

    useEffect(() => {
        if (pets.length > 0) {
            const foundPet = pets.find((pet) => pet.$id === id);
            setCurrentPet(foundPet || null);
        }
    }, [pets, id]);

    const handleDeleteEventClick = (event) => {
        setEventToDelete(event);
        setIsEventConfirmVisible(true);
    };

    const handleDeletePetClick = (pet) => {
        console.log("Deleting pet:", pet);
        setPetToDelete(pet);
    };
    const confirmDeleteEvent = async () => {
        try {
            await removeEvent(eventToDelete.id)
            fetchEvents(user.$id); // Fetch the updated events list
            setEventToDelete(null);
            setIsEventConfirmVisible(false);
            toast.warning("Event deleted!", { position: 'top-center', theme: 'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true })
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Error deleting event", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
        }
    }

    const cancelDelete = () => {
        setEventToDelete(null);
        setIsEventConfirmVisible(false);
    };
    
    const cancelDeletePet = () => {
        setPetToDelete(null);
        setIsPetConfirmVisible(false);
    };

    const cancelDeleteRegister = () => {
        setRegisterToDelete(null)
        setIsRegisterConfirmVisible(false);
    }

    if (!currentPet) {
        return <p className="text-center text-lg mt-10">Pet not found or still loading...</p>;
    }

    const calculateAge = (date) => {
        const birthDate = dayjs(date)
        const today = dayjs()
        let age = today.diff(birthDate, 'year')
        let ageText = `${age} years old`
        if (age < 1) {
            age = today.diff(birthDate, 'month')
            ageText = `${age} months old`
        }
        return ageText
    }

    const handleDeleteClick = (pet) => {
        setPetToDelete(pet);
        setIsPetConfirmVisible(true);
    };

    const confirmDeletePet = async () => {
        try {
            await removePet(petToDelete.$id)
            fetchPets(user.$id); 
            setPetToDelete(null);
            setIsPetConfirmVisible(false);
            toast.warning("Pet Deleted!", {position:'top-center', theme:'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true})
            navigate('/pets')
        } catch (error) {
            toast.error("Error deleting the pet", {position:'top-center', hideProgressBar: true, theme:'colored', closeOnClick: true, transition: Bounce})
            console.error("Error deleting pet:", error);
        }
    }

    const handleDeleteRegister = (register) => {
        setRegisterToDelete(register)
        setIsRegisterConfirmVisible(true)
        console.log(register)
    }

    const confirmDeleteRegister = async () => {
        try {
            await deleteRegisterEntry(registerToDelete.$id)
            fetchRegisterData(id)
            setRegisterToDelete(null)
            setIsRegisterConfirmVisible(false)
            toast.warning("Register Deleted!", {position:'top-center', theme:'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true})
        }
        catch (error) {
            toast.error("Error deleting register", {position:'top-center', hideProgressBar: true, theme:'colored', closeOnClick: true, transition: Bounce})
            console.error("Error deleting register:", error);
        }
    }

    return (
        <div className='mx-auto p-4 text-lg w-11/12'>
            {/* Title & Back Button */}
        <div className='flex flex-col md:flex-row justify-between items-start'>
            <h1 className="mb-3 letrasLogo text-4xl sm:text-5xl text-amber-600 drop-shadow-[1px_1px_0.5px_black]">
                Meet {currentPet.Name}
            </h1>
            <Link className="btn btn-warning mt-2 md:mt-0 mb-2" to={`/pets`}>
                Back to all pets
            </Link>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-auto">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        ) : (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mx-auto flex flex-col gap-5">
                {/* PC: Two Columns | Mobile: Stacked */}
                <div className="md:grid md:grid-cols-2 gap-5">
                    {/* Left Column (Image + Data & Buttons, then Events) */}
                    <div className="flex flex-col gap-5">
                        {/* Row 1: Pet Image & Data */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start">
                            <img
                                src={currentPet.Pet_Image || `https://picsum.photos/id/${randomNumber}/300/400`}
                                alt={currentPet.Name}
                                className="w-full sm:w-60 h-auto rounded object-cover shadow-md"
                            />
                            <div className='mt-4 sm:mt-0 sm:ml-4 flex flex-col w-full'>
                                <div className="space-y-2">
                                    <div><strong>Type:</strong> {currentPet.Type}</div>
                                    <div><strong>Breed/Species:</strong> {currentPet.breed_species || "Unknown"}</div>
                                    <div><strong>Age:</strong> {calculateAge(currentPet.birth_date) || "Not provided"}</div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:space-x-2 mt-4">
                                    <button className='btn btn-error' onClick={() => handleDeleteClick(currentPet)}>Delete {currentPet.Name}</button>
                                    <button className='btn btn-warning mt-2 sm:mt-0' onClick={() => setShowRegister(true)}>Add new register</button>
                                </div>
                                {showRegister && <RegisterFormModal closeModal={() => setShowRegister(false)} pet={currentPet} />}
                            </div>
                        </div>

                        {/* Row 2: Upcoming Events */}
                        <div>
                            <h2 className="text-lg font-semibold uppercase letrasLogo text-amber-600 drop-shadow-[0.7px_0.8px_0.5px_black]">Upcoming events</h2>
                            {filteredEvents.length === 0 ? (
                                <p>No events scheduled.</p>
                            ) : (
                                <ul className="bg-base-100 rounded-box shadow-md mb-4">
                                    {filteredEvents.map((event) => (
                                        <li key={event.id} className="flex items-center p-2 border-b">
                                            <div className="text-2xl sm:text-4xl font-thin opacity-30 w-[7rem]">{dayjs(event.start).format("DD/MM")}</div>
                                            <div className="flex-1">
                                                <div className='font-semibold uppercase opacity-90'>{event.title}</div>
                                            </div>
                                            <button className="btn btn-ghost ml-auto dropdown dropdown-right">
                                                <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                                                        <path d="M6 3L20 12 6 21 6 3z"></path>
                                                    </g>
                                                </svg>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-sm">
                                                    <li><a onClick={() => setEditingEvent(event)}>Edit</a></li>
                                                    <li><a onClick={() => handleDeleteEventClick(event)} className="hover:bg-red-700 hover:text-white">Delete</a></li>
                                                </ul>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Register History (Takes Full Height) */}
                    <div>
                        <h2 className="text-lg font-semibold uppercase letrasLogo text-amber-600 drop-shadow-[0.7px_0.8px_0.5px_black]">Register History</h2>
                        {Array.isArray(registerData) && registerData.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {registerData.map((entry, index) => (
                                    <li key={entry.$id || index} className="bg-base-100 p-2 rounded-md shadow-sm">
                                        <p>
                                            <strong>Date:</strong> {dayjs(entry.$createdAt).format("DD/MM/YYYY")}
                                            <span className='float-right'>
                                                <button className='btn btn-error btn-sm btn-soft' onClick={() => handleDeleteRegister(entry)}>X</button>
                                            </span>
                                        </p>
                                        {entry.food && <p><strong>Food:</strong> {entry.food}</p>}
                                        {entry.last_feeding && <p><strong>Last feeding:</strong> {new Date(entry.last_feeding).toLocaleDateString("en-US", { day: "numeric", month: "long" })}</p>}
                                        {entry.weight && <p><strong>Weight:</strong> {entry.weight} kg</p>}
                                        {entry.substrate && <p><strong>Substrate:</strong> {entry.substrate}</p>}
                                        {entry.temperature && <p><strong>Temperature:</strong> {entry.temperature} ºC</p>}
                                        {entry.humidity && <p><strong>Humidity:</strong> {entry.humidity} %</p>}
                                        {entry.activity_level && <p><strong>Level of activity:</strong> {entry.activity_level}</p>}
                                        {entry.medical_conditions.length >= 1 && <p><strong>Medical conditions:</strong> {entry.medical_conditions.join(", ")}</p>}
                                        {entry.medication.length >= 1 && <p><strong>Medication:</strong> {entry.medication.join(", ")}</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No register data available.</p>
                        )}
                    </div>
                </div>
            </div>
        )}
    
            {/* Modals */}
            {editingEvent && (
                <AddEventModal closeModal={() => setEditingEvent(null)} initialData={editingEvent} />
            )}
            <ConfirmationModal 
                show={isEventConfirmVisible} 
                onConfirm={confirmDeleteEvent} 
                onCancel={cancelDelete} 
                message={`Are you sure you want to delete "${eventToDelete?.title}"?`} />

            <ConfirmationModal 
                show={isPetConfirmVisible} 
                onConfirm={confirmDeletePet} 
                onCancel={cancelDeletePet} 
                message={`Are you sure you want to delete "${petToDelete?.Name}"?`} />

            <ConfirmationModal 
                show={isRegisterConfirmVisible} 
                onConfirm={confirmDeleteRegister} 
                onCancel={cancelDeleteRegister} 
                message={`Are you sure you want to delete this register?`} />

        </div>
    );
    
};

export default SinglePet;
