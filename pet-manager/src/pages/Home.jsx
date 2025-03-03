import React, { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import useEventsStore from "../store/useEventsStore";
import usePetsStore from "../store/usePetsStore";
import dayjs from "dayjs";
import ConfirmationModal from '../components/ConfirmationModal';
import AddEventModal from "../components/AddEventModal";

import { Bounce, Flip, toast } from "react-toastify";

const Home = () => {
  const { user } = useAuth();
  const { events, fetchEvents, removeEvent } = useEventsStore();
  const { pets, fetchPets } = usePetsStore();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEvents(user.$id);
      fetchPets(user.$id);
    }
  }, [user]);

  useEffect(() => {
    const today = dayjs().startOf("day");
    let updatedEvents = events;
    if (showUpcoming) {
      updatedEvents = events.filter(
        (event) => dayjs(event.start).isAfter(today) || dayjs(event.start).isSame(today)
      );
    }

    updatedEvents = updatedEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    setFilteredEvents(updatedEvents);
  }, [events, showUpcoming]);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setIsConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await removeEvent(eventToDelete.id)
      fetchEvents(user.$id); // Fetch the updated events list
      setEventToDelete(null);
      setIsConfirmVisible(false);
      toast.warning("Event deleted!", { position: 'top-center', theme: 'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true })
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
    }
  }

  const cancelDelete = () => {
    setEventToDelete(null);
    setIsConfirmVisible(false);
  };

  const randomNumber = Math.floor(Math.random() * 237);

  return (
    <main className="min-h-fit bg-[url('/src/assets/undraw_cat_lqdj.svg'),url('/src/assets/undraw_dog_jfxm.svg')] 
  bg-no-repeat bg-[length:30%,40%] bg-[position:left_center,right_center]">
      <div className="mx-auto p-4 text-2xl flex flex-col items-center">
        <img src="/src/assets/undraw_welcome-cats_tw36.svg" alt="Cat Icon" className="h-30 w-auto" />
        <h1 className="letrasLogo mb-4 text-4xl text-amber-600 drop-shadow-[1px_1px_0.5px_black]">
          {user?.name || "Guest"}
        </h1>

        {/* Toggle Button */}
        <div className="flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-500/5 rounded-xl dark:bg-gray-100">
          <button
            role="tab"
            type="button"
            className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-inset shadow ${activeTab === "upcoming"
              ? "text-yellow-600 bg-white dark:text-white dark:bg-yellow-600"
              : "hover:text-black-800 focus:text-yellow-600 dark:text-gray-400 dark:hover:text-gray-800 dark:focus:text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("upcoming");
              setShowUpcoming(!showUpcoming)
            }
            }
          >
            Upcoming
          </button>

          <button
            role="tab"
            type="button"
            className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-inset shadow ${activeTab === "allEvents"
              ? "text-yellow-600 bg-white dark:text-white dark:bg-yellow-600"
              : "hover:text-gray-800 focus:text-yellow-600 dark:text-gray-400 dark:hover:text-gray-800 dark:focus:text-gray-400"
              }`}
            onClick={() => {
              setActiveTab("allEvents");
              setShowUpcoming(!showUpcoming)
            }}
          >
            All Events
          </button>
        </div>

        {filteredEvents.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <ul className="list bg-base-100 rounded-box shadow-md w-1/2 mb-4">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{showUpcoming ? "Upcoming Events:" : "All Events:"}</li>

            {filteredEvents.map((event) => {
              // Relacionamos el evento con el pet para buscar la info hay que cambiarlo para que busque por id en vez de nombre
              const eventPet = pets?.find((p) => p.Name === event.pet);
              return (
                <li key={event.id} className="list-row flex flex-wrap items-center gap-2 sm:gap-3 p-3">
                  <div className="text-2xl sm:text-4xl font-thin opacity-30 tabular-nums w-[5rem] sm:w-[7rem] text-center">
                    {dayjs(event.start).format("DD/MM")}
                  </div>
                  <div className="flex items-center">
                    <img
                      className="size-10 sm:size-12 rounded-full h-10 sm:h-12 w-10 sm:w-12"
                      alt={event.pet || "Unknown Pet"}
                      src={eventPet?.Pet_Image || `https://picsum.photos/id/${randomNumber}/300/400`}
                    />
                  </div>
                  <div className="list-col-grow min-w-[50%] sm:min-w-[auto]">
                    <div className="text-sm sm:text-base">{event.title}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      {event.pet ? `With ${event.pet}` : "No Pet Assigned"}
                    </div>
                  </div>
                  <button className="btn btn-ghost ml-auto dropdown dropdown-bottom dropdown-end md:dropdown-right">
                    <svg className="size-[1em] sm:size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                        <path d="M6 3L20 12 6 21 6 3z"></path>
                      </g>
                    </svg>
                    <ul tabIndex={0} className="mx-4 dropdown-content menu bg-base-100 rounded-box z-1 w-40 sm:w-52 p-2 shadow-sm">
                      <li><a onClick={() => setEditingEvent(event)}>Edit</a></li>
                      <li><a onClick={() => handleDeleteClick(event)} className="hover:bg-red-700 hover:text-white">Delete</a></li>
                    </ul>
                  </button>
                </li>

              );
            })}
          </ul>
        )}
        {editingEvent && (
          <AddEventModal
            closeModal={() => setEditingEvent(null)}
            initialData={editingEvent}
          />
        )}

        <ConfirmationModal
          show={isConfirmVisible}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          message={`Are you sure you want to delete "${eventToDelete?.title}"?`}
        />
      </div>

    </main>
  );
};

export default Home;
