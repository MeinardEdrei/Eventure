'use client';

import axios from 'axios';
import '../css/eventDashboard.css';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function EventsDashboard() {
    const [event, setEvent] = useState([]);
    const [noEvents, setNoEvents] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState('upcoming');
    const [selectedEvent, setSelectedEvent] = useState(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await axios.get('http://localhost:5000/api/event/events');
                setEvent(res?.data);

                if (res.data.length === 0) {
                    setNoEvents(true);
                }
            } catch (error) {
                if (error.status === 404) {
                    setNoEvents(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    const filteredEvents = event.filter((event) => {
        const eventDate = new Date(event.date);
        const isPastEvent = eventDate < new Date();

        return (
            (selectedSection === 'upcoming' && !isPastEvent) ||
            (selectedSection === 'past' && isPastEvent)
        );
    });

    const openModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <div className="eventTitle">Events</div>
            <div className="eventDescription">
                Explore popular events near you, browse by category, or check out some of the great community calendars.
                <div className="toggleButtonContainer">
                    <button
                        className={`toggleButton ${selectedSection === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setSelectedSection('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`toggleButton ${selectedSection === 'past' ? 'active' : ''}`}
                        onClick={() => setSelectedSection('past')}
                    >
                        Past
                    </button>
                </div>
            </div>
            <div className="popularTitle">
                <h1>Popular Events</h1>
            </div>
            <div className="parentContainer">
                <div
                    className="popularContainer"
                    onClick={() =>
                        openModal({
                            event_Image: '/heronsNight.jpg',
                            title: 'UMak Jammers: Concert for a cause',
                            date: '2024-11-05T15:00:00',
                            description: 'A concert for a cause featuring UMak Jammers.',
                            location: 'UMak Grounds',
                            id: 'popularEvent1',
                        })
                    }
                >
                    <img src="/heronsNight.jpg" alt="" />
                    <div className="popularDetails">
                        <h1>UMak Jammers: Concert for a cause</h1>
                        <p>November 5, 2024 - 3:00 PM</p>
                    </div>
                </div>
                <div
                    className="popularContainer"
                    onClick={() =>
                        openModal({
                            event_Image: '/heronsNight.jpg',
                            title: 'UMak Jammers: Concert for a cause',
                            date: '2024-11-05T15:00:00',
                            description: 'A concert for a cause featuring UMak Jammers.',
                            location: 'UMak Grounds',
                            id: 'popularEvent2',
                        })
                    }
                >
                    <img src="/heronsNight.jpg" alt="" />
                    <div className="popularDetails">
                        <h1>UMak Jammers: Concert for a cause</h1>
                        <p>November 5, 2024 - 3:00 PM</p>
                    </div>
                </div>
            </div>

            <hr />

            <div className="parentContainer">
                {noEvents ? (
                    <div className="noEvents">Message: No events found</div>
                ) : (
                    filteredEvents.map((event) => (
                        <div
                            className="cardContainer"
                            key={event.id}
                            onClick={() => openModal(event)}
                        >
                            <div className="cardImage">
                                <img
                                    src={`http://localhost:5000/api/event/uploads/${event.event_Image}`}
                                    alt={event.title}
                                />
                            </div>
                            <div className="info">
                                <div className="cardTitle">{event.title}</div>
                                <div className="cardDetails">
                                    <p>{event.location}</p>
                                    <p>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}{' '}
                                        -{' '}
                                        {new Date(event.date).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                                <hr />
                                <div className="cardDescription">{event.description}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            
            {isModalOpen && selectedEvent && (
                <div className="modal">
                <div className="modalContent">
                    <div className="closeButtonBox">
                        <button className="eventClose" onClick={closeModal}>
                            &times;
                        </button>
                    </div>
                    <img
                        src={selectedEvent.event_Image.startsWith('/')
                            ? selectedEvent.event_Image
                            : `http://localhost:5000/api/event/uploads/${selectedEvent.event_Image}`
                        }
                        alt={selectedEvent.title}
                        className="modalImage"
                    />
                    <div className="modalDetails">
                        <h2>{selectedEvent.title}</h2>
                        <p>
                            {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}{' '}
                            -{' '}
                            {new Date(selectedEvent.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </p>
                        <p>{selectedEvent.location}</p>
                        <hr />
                        <p>{selectedEvent.description}</p>
                        <hr />
                        <div className="hosts">
                            <h3>Hosted by</h3>
                            <div className="userHosts">
                                <img src="/user.jpg" alt="" />
                                <p>UMak Jammers</p>
                                <img src="/user.jpg" alt="" />
                                <p>UMak Jammers</p>
                            </div>
                        </div>
                        <div className="eventButtons">
                            <button className='requestJoin'>Request to join</button>
                            {/* <Link href={`/Event-Post/${selectedEvent.id}`}>
                                <button className="expandButton">Expand</button>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
            
            )}
        </div>
    );
}

export default EventsDashboard;
