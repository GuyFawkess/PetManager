import React, { useEffect, useState } from 'react';
import useEventsStore from '../store/useEventsStore';
import { useAuth } from '../store/AuthContext';

import AddEventModal from '../components/AddEventModal';
import ConfirmationModal from '../components/ConfirmationModal';

import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';

import { toast, Bounce, Flip } from 'react-toastify';

const localizer = dayjsLocalizer(dayjs);

const MyCalendar = () => {
  const { events, loading, fetchEvents, removeEvent } = useEventsStore();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [selectedView, setSelectedView] = useState('month');

  const components = {
    event: (props) => (
      <div style={{ color: "black", fontSize: "12px", position: "relative" }}>
        <span>{props.title} {props.event.pet && `with ${props.event.pet}`}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents clicking on the calendar event itself
            handleDeleteClick(props.event);
          }}
          className="absolute right-0 top-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
        >
          X
        </button>
      </div>
    ),
    toolbar: (props) => {
      const handleViewChange = (view) => {
        setSelectedView(view);
        props.onView(view);
      }

      return (
        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-warning rounded-md gap-2 md:gap-0">
          {/* Left Side - Navigation */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <button onClick={() => props.onNavigate("TODAY")} className="btn btn-sm md:btn-md">
              Today
            </button>
            <button onClick={() => props.onNavigate("PREV")} className="btn btn-sm md:btn-md">
              Back
            </button>
            <button onClick={() => props.onNavigate("NEXT")} className="btn btn-sm md:btn-md">
              Next
            </button>
            <button
              onClick={openModal}
              className="btn btn-sm md:btn-md bg-blue-500 text-white px-3 py-1 rounded-md"
            >
              Add Event
            </button>
          </div>
          {/* Center - Month Label */}
          <span className="letrasLogo text-xl md:text-3xl text-amber-600 drop-shadow-[1px_1.5px_1px_black] text-center mt-2 md:mt-0">
            {props.label}
          </span>
          {/* Right Side - View Selection */}
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            {["month", "week", "day", "agenda"].map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`btn btn-sm md:btn-md ${selectedView === view ? "bg-blue-500 text-white" : ""
                  }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      );
    },
  };

  const openModal = () => {
    setShowModal(true);
    console.log(events)
  }

  const closeModal = () => {
    setShowModal(false);
  }

  // Fetch events
  useEffect(() => {
    if (user) {
      fetchEvents(user.$id);
    }
  }, [user]);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setIsConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await removeEvent(eventToDelete.id);
      fetchEvents(user.$id); // Fetch the updated events list
      setEventToDelete(null);
      setIsConfirmVisible(false);
      toast.warning("Event deleted!", { position: 'top-center', theme: 'colored', closeOnClick: true, transition: Flip, autoClose: 2000, hideProgressBar: true })
    } catch (error) {
      toast.error("Error deleting event", { position: 'top-center', hideProgressBar: true, theme: 'colored', closeOnClick: true, transition: Bounce })
      console.error("Error deleting event:", error);
    }
  }

  const cancelDelete = () => {
    setEventToDelete(null);
    setIsConfirmVisible(false);
  };

  return (
    <div className='max-w-11/12 justify-center mx-auto max-h-screen mt-6'>

      {showModal && <AddEventModal closeModal={closeModal} />}

      {loading && <p>Loading events...</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={components}
      />
      <ConfirmationModal
        show={isConfirmVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={`Are you sure you want to delete "${eventToDelete?.title}"?`}
      />
    </div>
  );
};

export default MyCalendar;
