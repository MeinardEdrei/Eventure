'use client';
import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    addMonths,
    subMonths,
} from 'date-fns';
import '../css/eventCalendar.css';

function EventCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    //events
    const [events, setEvents] = useState({
        "2024-11-05": ["UMak Jammers: Concert for a cause"],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const handleDateClick = (date) => {
        setSelectedDate(format(date, 'yyyy-MM-dd'));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const generateCalendarDays = () => {
        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);

        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const calendar = [];
        const emptyStartDays = getDay(startDate);
        const emptyEndDays = 6 - getDay(endDate);

        for (let i = 0; i < emptyStartDays; i++) {
            calendar.push(<div key={`empty-start-${i}`} className="day empty"></div>);
        }

        // Add the actual days
        days.forEach((date) => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const hasEvent = !!events[formattedDate];
            calendar.push(
                <div
                    key={formattedDate}
                    className={`day ${hasEvent ? 'hasEvent' : ''}`}
                    onClick={() => handleDateClick(date)}
                >
                    {format(date, 'd')}
                    {hasEvent && <span className="eventDot"></span>}
                </div>
            );
        });

        for (let i = 0; i < emptyEndDays; i++) {
            calendar.push(<div key={`empty-end-${i}`} className="day empty"></div>);
        }

        return calendar;
    };

    return (
        <>
            <div className="container">
                <div className="eventTitle">Calendar of events</div>
                <div className="eventDescription">
                    A visual schedule showcasing upcoming, ongoing, and past events at a glance.
                </div>
                <div className="calendarHeader">
                    <button onClick={handlePrevMonth} className="navButton">
                        &lt; Prev
                    </button>
                    <div className="monthTitle">{format(currentDate, 'MMMM yyyy')}</div>
                    <button onClick={handleNextMonth} className="navButton">
                        Next &gt;
                    </button>
                </div>
                <div className="calendarContainer">
                    <div className="daysOfWeek">
                        {daysOfWeek.map((day, index) => (
                            <div key={index} className="dayName">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="calendarGrid">{generateCalendarDays()}</div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>{selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : ''}</h2>
                        <hr />
                        <ul>
                            {events[selectedDate]?.length > 0 ? (
                                events[selectedDate].map((event, index) => (
                                    <li key={index}>{event}</li>
                                ))
                            ) : (
                                <p>No events scheduled.</p>
                            )}
                        </ul>
                        <button className="closeButton" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default EventCalendar;
