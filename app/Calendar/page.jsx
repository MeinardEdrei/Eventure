'use client';
import axios from 'axios';
import '../css/newCalendar.css';
import { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [events, setEvents] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/event/events"
        );

        const formattedEvents = response.data.reduce((acc, event) => {
          const eventDate = format(new Date(event.dateStart), "yyyy-MM-dd");
          const eventTitle = event.title;

          // If the date key doesn't exist, create it
          if (!acc[eventDate]) {
            acc[eventDate] = [];
          }

          // Push the event description into the array for that date
          acc[eventDate].push(eventTitle);
          return acc;
        }, {});

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        alert(error.message);
        setEvents({});
      }
    };

    fetchEvents();
  }, []);

  // const events = {
  //   '2024-12-25': ['Unite and Ignite: Acquaintance Party 2024', 'Herons Night'],
  //   '2024-12-31': ['New Year’s Eve Celebration'],
  // };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const renderCalendarDays = () => {
    const calendarDays = [];

    // Add empty boxes for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div className="empty" key={`empty-${i}`}></div>);
    }

    // Add boxes for each day in the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateString = format(date, 'yyyy-MM-dd');
      const hasEvent = events[dateString];

      calendarDays.push(
        <div
          key={day}
          className={`day ${selectedDate === dateString ? 'selected' : ''}`}
          onClick={() => setSelectedDate(dateString)}
        >
          {day}
          {hasEvent && <span className="event-indicator"></span>}
        </div>
      );
    }

    // Calculate remaining empty boxes after the last day of the month
    const totalGridItems = firstDay + daysInMonth;
    const remainingDays = 7 - (totalGridItems % 7);

    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        calendarDays.push(
          <div className="empty" key={`empty-end-${i}`}></div>
        );
      }
    }

    return calendarDays;
  };

  return (
    <>
      <div className="newCalendarBody">
        <div className="newCalendarContainer">
          <div className="newCalendarHeader">
            <h1>Event Calendar</h1>
            <p>
              Stay updated with all upcoming events in one organized calendar
              view.
            </p>
          </div>

          <div className="calendarContent">
            {/* Left Side: Calendar */}
            <div className="calendar">
              <div className="calendarControls">
                <button onClick={handlePrevMonth}>◀</button>
                <span>
                  {currentDate.toLocaleString('default', {
                    month: 'long',
                  })}{' '}
                  {currentDate.getFullYear()}
                </span>
                <button onClick={handleNextMonth}>▶</button>
              </div>
              <hr />
              <div className="dayTitles">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, index) => (
                    <div className="dayTitle" key={index}>
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="calendarGrid">{renderCalendarDays()}</div>
            </div>

            {/* Right Side: Event Details */}
            <div className="eventDetails">
            <h2>
              {selectedDate
                ? `Events on ${new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}`
                : 'Select a date to see events'}
            </h2>
              <ul>
                {selectedDate && events[selectedDate]
                  ? events[selectedDate].map((event, index) => (
                      <li key={index}>{event}</li>
                    ))
                  : selectedDate && <li>No events on this date</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
