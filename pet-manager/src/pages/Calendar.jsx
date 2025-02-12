import React, { useEffect, useState } from 'react';
import useEventsStore from '../store/useEventsStore';
import { useAuth } from '../store/AuthContext';

import AddEventModal from '../components/AddEventModal';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';

import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';

const localizer = dayjsLocalizer(dayjs);



const MyCalendar = () => {
  const { events, loading, fetchEvents, removeEvent } = useEventsStore();
  const {user} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const components = {
    event: (props) => (
      <div style={{ color: 'black', fontSize: '12px', position: 'relative' }}>
        <span>{props.title} {props.event.pet && `with ${props.event.pet}`}</span>
        <button onClick={(e) => {
          handleDeleteClick(props.event)
        }}
        className='absolute right-0 top-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>
          X
        </button>
      </div>
    ),
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
    if(user){
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
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    }

  const cancelDelete = () => {
      setEventToDelete(null);
      setIsConfirmVisible(false);
    };
  
  
  return (
    <div className="bg-green-200 p-4">
   <Button handleClick={openModal} text="Add Event" />
      {showModal && <AddEventModal closeModal={closeModal} />}


      {loading && <p>Loading events...</p>}
      <Calendar
        className="bg-sky-300"
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
