    'use client';
    import '../css/organizerEvents.css';
    import Image from 'next/image';
    import Link from 'next/link';
    import { useSession } from 'next-auth/react';
    import { useState, useRef, useEffect } from 'react';

    function OrganizerEvents() {
        const [activeButton, setActiveButton] = useState('Overview');
        const textareaRef = useRef(null); // Reference to the textarea

        const handleButtonClick = (buttonName) => {
            setActiveButton(buttonName);
        };

        useEffect(() => {
            const textarea = textareaRef.current;
        
            const adjustHeight = () => {
                textarea.style.height = 'auto'; // Reset the height
                textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
            };
        
            if (textarea) {
                adjustHeight(); // Adjust height on component mount
                textarea.addEventListener('input', adjustHeight);
                return () => textarea.removeEventListener('input', adjustHeight); // Cleanup
            }
        }, []);    

        return (
            <>
                <div className="container">
                    <div className="eventTitle">Heron's Night</div>
                    <div className="dashboardButtons">
                        {['Overview', 'Registration', 'Share', 'More'].map((name) => (
                            <button
                                key={name}
                                className={activeButton === name ? 'active' : ''}
                                onClick={() => handleButtonClick(name)}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                    <div className="output">

                        {activeButton === 'Overview' && (
                            <>
                                <hr />
                                <div className="overviewContainer">
                                    <img src="/heronsNight.jpg" alt="Heron's Night" />
                                    <div className="overviewDetails">
                                        <h1>UMak Jammers Concert for a cause</h1>
                                        <p>UMak Oval</p>
                                        <p>November 5, 2024 - 3:00 PM</p>
                                        <button>Edit Event</button>
                                    </div>
                                </div>
                                <hr />
                                <div className="eventHeader">
                                    <h6>Event Details</h6>
                                </div>
                                <div className="statContainer">
                                    <p className="eventStatistic">Registered: 62</p>
                                    <p className="eventStatistic">Attending: 102</p>
                                    <p className="eventStatistic">Cancelled: 210</p>
                                </div>
                                <hr />
                                <div className="eventHeader">Event Partners</div>
                                <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                                <div className="guestContainer">
                                    <div className="guestDetails">
                                        <h6>UMak Jammers</h6>
                                        <p>umakjammers@umak.edu.ph</p> 
                                    </div>
                                    <div className="smallhr">
                                        <hr />
                                    </div>
                                    <div className="guestDetails">
                                        <h6>UMak Jammers</h6>
                                        <p>umakjammers@umak.edu.ph</p>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {activeButton === 'Registration' && 
                            <>
                            <hr />
                            <div className="eventHeader">Event Attendees</div>
                                <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                                <div className="guestContainer">
                                    <div className="guestDetails">
                                        <h6>Lougie Caday</h6>
                                        <p>lcaday.k123456789@umak.edu.ph</p> 
                                        <div className="buttons">
                                            <button>Approve</button>
                                            <button>Disapprove</button>
                                        </div>
                                    </div>
                                    <div className="smallhr">
                                        <hr />
                                    </div>
                                    <div className="guestDetails">
                                        <h6>Meinard Santos</h6>
                                        <p>msantos.k123456789@umak.edu.ph</p>
                                        <div className="buttons">
                                            <button>Approve</button>
                                            <button>Disapprove</button>
                                        </div>
                                    </div>
                                    <div className="smallhr">
                                        <hr />
                                    </div>
                                    <div className="guestDetails">
                                        <h6>Jayson Huub Partido</h6>
                                        <p>jpartido.k123456789@umak.edu.ph</p>
                                        <div className="buttons">
                                            <button>Approve</button>
                                            <button>Disapprove</button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="guestDetails">
                                        <h6>Eric Lor</h6>
                                        <p>elor.k123456789@umak.edu.ph</p>
                                        <div className="buttons">
                                            <button>Approve</button>
                                            <button>Disapprove</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                        {activeButton === 'Share' && 
                        <>
                        <hr />
                            <div className="eventHeader">Send Notifications</div>
                                <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                                <div className="postContainer">
                                <textarea
                                    ref={textareaRef}
                                    placeholder="Say something meaningful..."
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${e.target.scrollHeight}px`; 
                                    }}
                                    style={{
                                        overflowY: 'auto'
                                    }}
                                />
                                <div className="postButtons">
                                    <button>Attach an image</button>
                                    <button>Send</button>
                                </div>
                                </div>
                                <hr />
                                <div className="eventHeader">Share Event</div>
                                <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                                <div className="sharebutton">
                                    <button>Facebook</button>
                                    <button>Instagram</button>
                                    <button>Twitter</button>
                                </div>
                        </>
                        }
                        
                        {activeButton === 'More' && 
                        <>
                        <hr />
                        <div className="eventHeader">Cancel Event</div>
                        <div className="organizerDescription">Cancel and permanently delete this event. This operation cannot
                            be undone. If there are any registered guests, we will notify them that the event has been cancelled.
                        </div>
                        <div className="cancelButton">
                        <button>Cancel</button>
                        </div>
                        </>
                        }
                    </div>
                </div>
            </>
        );
    }

    export default OrganizerEvents;
