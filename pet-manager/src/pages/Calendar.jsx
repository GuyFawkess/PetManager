import React, { useEffect, useState } from 'react';
import useEventsStore from '../store/useEventsStore';
import { useAuth } from '../store/AuthContext';

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
  const { events, loading, fetchEvents, createEvent } = useEventsStore();
  const {user} = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: ''
  });

  const [showForm, setShowForm] = useState(false);

  // Fetch events
  useEffect(() => {
    if(user){
      fetchEvents(user.$id);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.title || !formData.start || !formData.end) {
      alert('Please fill all the fields');
      return;
    }

    // Validate date inputs
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Invalid date format. Please check the start and end dates.');
      return;
    }

    // Create new event
    const newEvent = {
      Title: formData.title,
      StartDate: startDate.toISOString(),
      EndDate: endDate.toISOString(),
      OwnerID: user.$id
    };

    createEvent(newEvent); // Add the new event
    setFormData({ title: '', start: '', end: '' }); // Reset form
    setShowForm(false); // Close form
  };

  return (
    <div className="bg-orange-400 p-4">
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        {showForm ? 'Close Form' : 'Add Event'}
      </button>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-4 bg-white p-4 rounded shadow">
          <div className="mb-4">
            <label className="block font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              placeholder="Event Title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Start Date & Time</label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">End Date & Time</label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Add Event
          </button>
        </form>
      )}

      {loading && <p>Loading events...</p>}

      <Calendar
        className="bg-orange-400"
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
