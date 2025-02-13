import React, { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import useEventsStore from "../store/useEventsStore";
import usePetsStore from "../store/usePetsStore";
import dayjs from "dayjs";

const Home = () => {
  const { user } = useAuth();
  const { events, fetchEvents } = useEventsStore();
  const { pets, fetchPets } = usePetsStore();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");	

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

  return (
    <div className="container mx-auto p-4 text-2xl flex flex-col items-center">
      <h1 className="font-bold mb-4 text-3xl text-red-500">
        Welcome {user?.name || "Guest"}
      </h1>

      {/* Toggle Button */}
      <div className="flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-500/5 rounded-xl dark:bg-gray-500/20">
        <button
          role="tab"
          type="button"
          className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-inset shadow ${activeTab === "upcoming"
              ? "text-yellow-600 bg-white dark:text-white dark:bg-yellow-600"
              : "hover:text-gray-800 focus:text-yellow-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
            }`}
          onClick={() =>{
            setActiveTab("upcoming");
            setShowUpcoming(!showUpcoming)}
          } 
        >
          Upcoming
        </button>

        <button
          role="tab"
          type="button"
          className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-inset shadow ${activeTab === "allEvents"
              ? "text-yellow-600 bg-white dark:text-white dark:bg-yellow-600"
              : "hover:text-gray-800 focus:text-yellow-600 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:text-gray-400"
            }`}
          onClick={() => {
            setActiveTab("allEvents");
            setShowUpcoming(!showUpcoming)}}
        >
          All Events
        </button>
      </div>
      {/* <button
        onClick={() => setShowUpcoming(!showUpcoming)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {showUpcoming ? "Show All Events" : "Show Upcoming Events"}
      </button> */}

      {/* <h2 className="font-bold text-xl mt-4">
        {showUpcoming ? "Upcoming Events:" : "All Events:"}
      </h2> */}

      {filteredEvents.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="list bg-base-100 rounded-box shadow-md w-1/2">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{showUpcoming ? "Upcoming Events:" : "All Events:"}</li>
          {filteredEvents.map((event) => {
            // Relacionamos el evento con el pet para buscar la info
            const eventPet = pets?.find((p) => p.id === event.PetID);
            return (
              <li key={event.id} className="list-row h-20 flex items-center">
                <div className="text-4xl font-thin opacity-30 tabular-nums w-[7rem]">
                  {dayjs(event.start).format("DD/MM")}
                </div>
                <div className="flex items-center">
                  <img
                    className="size-10 rounded-box"
                    alt={event.pet || "Unknown Pet"}
                    src={eventPet?.image || "https://picsum.photos/id/237/300/400"}
                  />
                </div>
                <div className="list-col-grow">
                  <div>{event.title}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {event.pet ? `With ${event.pet}` : "No Pet Assigned"}
                  </div>
                </div>
                {/* cambiar boton aqui que te lleve al calendario o borrar notificacion */}
                <button className="btn btn-square btn-ghost ml-auto">
                  <svg
                    className="size-[1.2em]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                      <path d="M6 3L20 12 6 21 6 3z"></path>
                    </g>
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Home;
