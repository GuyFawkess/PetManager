import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import usePetsStore from "../store/usePetsStore";
import useEventsStore from "../store/useEventsStore";
import dayjs from "dayjs";
import { useRegisterStore } from '../store/useRegisterStore';
import { toast } from 'react-toastify';
import { Flip, Bounce } from 'react-toastify';
import RegisterFormModal from '../components/RegisterFormModal';


const SinglePet = () => {
    const { pets, fetchPets, removePet, loading } = usePetsStore();
    const { fetchRegisterData, registerData } = useRegisterStore();
    const { events, fetchEvents, removeEvent } = useEventsStore();

    const { user } = useAuth();
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const { id } = useParams();
    const [currentPet, setCurrentPet] = useState(null);
    const navigate = useNavigate();
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showRegister, setShowRegister] = useState(false);

    const randomNumber = Math.floor(Math.random() * 237)


    useEffect(() => {
        if (user) {
            fetchPets(user.$id);
            fetchRegisterData(id)
            fetchEvents(user.$id);
        }
    }, [user]);

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

    const calculateAge = (date) => {
        const birthDate = dayjs(date)
        const today = dayjs()
        let age = today.diff(birthDate, 'year')
        let ageText = `${age} years old`
        if (age < 1){
            age = today.diff(birthDate, 'month')
            ageText = `${age} months old`
        }
        return ageText
    }

    return (
        <main className="min-h-130 bg-[url('/src/assets/undraw_friends_xscy.svg')] 
        bg-no-repeat bg-[length:40%] bg-[position:right_top]">
            <div className='mx-auto p-4 text-2xl w-11/12'>
                <h1 className="mb-3 letrasLogo text-5xl text-amber-600 drop-shadow-[1px_1px_0.5px_black]">
                    Meet {currentPet.Name}
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <span className="loading loading-spinner loading-xl"></span>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md mx-auto grid grid-cols-2 grid-rows-2 gap-3">
                        <div className='col-span-2 flex'>
                            <div> <img
                                src={currentPet.Pet_Image || `https://picsum.photos/id/${randomNumber}/300/400`}
                                alt={currentPet.Name}
                                className="w-50 h-60 object-cover border-gray-300"
                            /></div>
                            <div className='mx-4'>
                                <p><strong>Type:</strong> {currentPet.Type}</p>
                                <p><strong>Breed/Species:</strong> {currentPet.breed_species || "Unknown"}</p>
                                <p><strong>Age:</strong> {calculateAge(currentPet.birth_date) || "Not provided"}</p>
                                <button className='btn btn-warning mt-1'>Edit details</button>
                                <button className='btn btn-warning mt-1 ms-1' onClick={() => setShowRegister(true)}>Add new register</button>
                                {showRegister && <RegisterFormModal closeModal={() => setShowRegister(false)} pet={currentPet} />}
                            </div>
                        </div>
                        <div className='row-start-2'>
                            {filteredEvents.length === 0 ? (
                                <p>No events scheduled.</p>
                            ) : (
                                <ul>
                                    {filteredEvents.map((event) => {
                                        const eventPet = pets?.find((p) => p.Name === event.pet);
                                        return (
                                            <li key={event.id} className="list-row h-20 flex items-center">
                                                <div className="text-4xl font-thin opacity-30 tabular-nums w-[7rem]">
                                                    {dayjs(event.start).format("DD/MM")}
                                                </div>
                                                
                                                <div className="list-col-grow">
                                                    <div>{event.title}</div>
                                                    <div className="text-xs uppercase font-semibold opacity-60">
                                                        {event.pet ? `With ${event.pet}` : "No Pet Assigned"}
                                                    </div>
                                                </div>
                                                {/* cambiar boton aqui que te lleve al calendario o borrar notificacion */}
                                                <button className="btn btn-ghost ml-auto dropdown dropdown-right dropdown-center">
                                                    <svg
                                                        className="size-[1.2em]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                                                            <path d="M6 3L20 12 6 21 6 3z"></path>
                                                        </g>
                                                    </svg>
                                                    <ul tabIndex={0} className="mx-4 dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                        <li><a onClick={() => setEditingEvent(event)}>Edit</a></li>
                                                        <li><a onClick={() => handleDeleteClick(event)} className="hover:bg-red-700 hover:text-white">Delete</a></li>
                                                    </ul>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                        <div className='row-start-2'>
                            <p><strong>food:</strong> {registerData[0]?.food || "Not provided"}</p>
                        </div>

                    </div>
                )}
                <Link className="btn btn-warning mt-2" to={`/pets`}>
                    Back to all pets
                </Link>

            </div>








            {/* <div className="flex justify-center">
                        <h1 className="mb-3 letrasLogo text-5xl text-amber-600 drop-shadow-[1px_1px_0.5px_black]">Meet {currentPet.Name}</h1>
                <div className="bg-white p-6 rounded-lg shadow-md w-11/12">
                    <div className="flex justify-between items-center">
                         
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
            </div> */}
        </main>
    );
};

export default SinglePet;
