'use client';
import '../css/userProfile.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
    const [selectedSection, setSelectedSection] = useState('upcoming');
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5000/api/user/userEvents/${session.user.id}`);
            setAttendedEvents(response.data);

            if (response.status === 404) {
                alert(response.message);
            }
        };
        if (session) {
            fetchData();
        }
    }, [session]);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    return (
        <>
            <div className="container">
                <div className="userContainer">
                    <div className="userIcon">
                        <img src="/user.jpg" alt="User Icon" />
                    </div>

                    <div className="userDetails">
                        <h6>{session?.user?.username}</h6>
                        <p>{session?.user?.email}</p>
                        <p>Attended Events: {session?.user?.attended_events}</p>
                        <button onClick={handleModalOpen}>Edit Profile</button>
                    </div>
                </div>

                <div className="subcon">
                    <div className="semiheader">Event Timeline</div>
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

                <hr />

                {attendedEvents.length > 0 && (
                    attendedEvents.map((event, index) => {
                        const eventDate = new Date(event.date);
                        const isPastEvent = eventDate < new Date();

                        if (selectedSection === 'upcoming' && !isPastEvent) {
                            return (
                                <div key={index} className="eventSection">
                                    <div className="eventContainer">
                                        <div className="eventImage">
                                            <img src="/heronsNight.jpg" alt={event.title} />
                                        </div>
                                        <div className="eventDetails">
                                            <div className="semiheader">{event.title}</div>
                                            <p>{event.location}</p>
                                            <p>{eventDate.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else if (selectedSection === 'past' && isPastEvent) {
                            return (
                                <div key={index} className="eventSection">
                                    <div className="eventContainer">
                                        <div className="eventImage">
                                            <img src="/heronsNight.jpg" alt={event.title} />
                                        </div>
                                        <div className="eventDetails">
                                            <div className="semiheader">{event.title}</div>
                                            <p>{event.location}</p>
                                            <p>{eventDate.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null; 
                    })
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modalOverlay">
                    <div className="profileModalContent">
                        <h2>Edit Profile</h2>
                        <hr />
                        <form>
                            <div className="modalInput">
                                <label>
                                    <h3>Username:</h3>
                                    <input type="text" defaultValue={session?.user?.username} placeholder='Type your username...'/>
                                </label>
                            </div>
                            <div className="modalInput">
                                <label>
                                    <h3>Change profile picture</h3>
                                    <div className="previewProfile">
                                        <h4>Preview</h4>
                                        <img src="/user.jpg" alt=""/>
                                    </div>
                                    <button className='changePicture'>Change Picture</button>
                                </label>
                            </div>
                            
                            <div className="userButtons">
                                <button type="button" onClick={handleModalClose}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserProfile;
