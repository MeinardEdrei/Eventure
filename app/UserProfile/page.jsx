'use client';
import '../css/userProfile.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

function UserProfile() {
    const [selectedSection, setSelectedSection] = useState('upcoming');

    return (
        <>
        <div className="container">
            <div className="userContainer">
                <div className="userIcon">
                    <img src="/user.jpg" alt="User Icon" />
                </div>

                <div className="userDetails">
                    <h6>Jayson Partido</h6>
                    <p>Attended Events: 21</p>
                    <button>Edit Profile</button>
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

            {selectedSection === 'upcoming' ? (
                    <div className="eventSection">
                        <div className="eventContainer">
                            <div className="eventImage">
                                <img src="/heronsNight.jpg" alt="" />
                            </div>
                            <div className="eventDetails">
                                <div className="semiheader">Heron's Night</div>
                                <p>UMak Oval</p>
                                <p>November 30, 2024</p>
                            </div>
                        </div>
                        <div className="eventContainer">
                            <div className="eventImage">
                                <img src="/heronsNight.jpg" alt="" />
                            </div>
                            <div className="eventDetails">
                                <div className="semiheader">Heron's Night</div>
                                <p>UMak Oval</p>
                                <p>November 30, 2024</p>
                            </div>
                        </div>
                        <div className="eventContainer">
                            <div className="eventImage">
                                <img src="/heronsNight.jpg" alt="" />
                            </div>
                            <div className="eventDetails">
                                <div className="semiheader">Heron's Night</div>
                                <p>UMak Oval</p>
                                <p>November 30, 2024</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="eventSection">
                        <div className="eventContainer">
                            <div className="eventImage">
                                <img src="/heronsNight.jpg" alt="" />
                            </div>
                            <div className="eventDetails">
                                <div className="semiheader">Event Past</div>
                                <p>UMak Oval</p>
                                <p>November 30, 2024</p>
                            </div>
                        </div>
                    </div>
                )}
        </div>
        </>
    );
}

export default UserProfile;