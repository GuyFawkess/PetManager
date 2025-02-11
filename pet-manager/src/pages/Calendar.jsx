import React, { useEffect, useState } from 'react';
import useEventsStore from '../store/useEventsStore';
import { useAuth } from '../store/AuthContext';

import AddEventModal from '../components/AddEventModal';
import Button from '../components/Button';

import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';

const localizer = dayjsLocalizer(dayjs);

const components = {
  event: (props) => (
    <div style={{ color: 'black', fontSize: '12px' }}>
      {props.title}
    </div>
  ),
};

const MyCalendar = () => {
  const { events, loading, fetchEvents } = useEventsStore();
  const {user} = useAuth();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    console.log('Opening modal');
    setShowModal(true);

  }

  const closeModal = () => {
    console.log('Closing modal');
    setShowModal(false);
  }

  // Fetch events
  useEffect(() => {
    if(user){
      fetchEvents(user.$id);
    }
  }, [user]);


  
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

    </div>
  );
};

export default MyCalendar;
