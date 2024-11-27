'use client';
import '../../css/organizerEvents.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

function OrganizerEvents() {
    const { id } = useParams();
    const [activeButton, setActiveButton] = useState('Overview');
    const textareaRef = useRef(null); // Reference to the textarea
    const [selectedSection, setSelectedSection] = useState('upcoming');
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState([]);
    const [partners, setPartners] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res1 = await axios.get(`http://localhost:5000/api/event/events${id}`)
                // const res2 = await axios.get(`http://localhost:5000/api/event/events${id}`)
                setEvent(res1.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container">
                <div className="eventTitle">{event.title}</div>
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
                                    <h1>{event.title}</h1>
                                    <p>{event.location}</p>
                                    <p>
                                        {new Date(event.date).toLocaleDateString('en-us', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })} - {new Date(event.date).toLocaleTimeString('en-us', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })}
                                    </p>
                                    <button>Edit Event</button>
                                </div>
                            </div>
                            <hr />
                            <div className="organizerHeader">
                                <h6>Event Details</h6>
                            </div>
                            <div className="statContainer">
                                <p className="eventStatistic">Pending: {event?.pending || 0}</p>
                                <p className="eventStatistic">Attending: {event?.attendees_Count || 0}</p>
                                <p className="eventStatistic">Cancelled: {event?.cancelled || 0}</p>
                            </div>
                            <hr />
                            <div className="organizerHeader">Event Partners</div>
                            <div className="organizerDescription">Add hosts, special guests, and event managers.</div>
                            <div className="guestContainer">
                                <div className="guestDetails">
                                    <h6>{event.partnerships}</h6>
                                    <p>umakjammers@umak.edu.ph</p> 
                                </div>
                                <div className="smallhr">
                                    <hr />
                                </div>
                            </div>
                            <div className="addHosts"><button>Add Hosts</button></div>
                        </>
                    )}
                    
                    {activeButton === 'Registration' && (
                        <>
                            <hr />
                            <div className="section">
                                <div className="sectionTitle">
                                    <div className="organizerHeader">Pending List</div>
                                    <div className="organizerDescription">
                                        Manage and view participant details for streamlined event coordination.
                                    </div>
                                </div>

                                {/* Toggle Button Container */}
                                <div className="toggleButtonContainer">
                                    <button
                                        className={`toggleButton ${selectedSection === 'waiting' ? 'active' : ''}`}
                                        onClick={() => setSelectedSection('waiting')}
                                    >
                                        Waiting
                                    </button>
                                    <button
                                        className={`toggleButton ${selectedSection === 'attending' ? 'active' : ''}`}
                                        onClick={() => setSelectedSection('attending')}
                                    >
                                        Attending
                                    </button>
                                </div>
                            </div>

                            {/* Dynamic Content Section */}
                            <div className="contentSection">
                                {selectedSection === 'waiting' && (
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
                                        <div className="smallhr">
                                            <hr />
                                        </div>
                                        <div className="guestDetails">
                                            <h6>Eric Lor</h6>
                                            <p>elor.k123456789@umak.edu.ph</p>
                                            <div className="buttons">
                                                <button>Approve</button>
                                                <button>Disapprove</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedSection === 'attending' && (
                                    <div className="attendeeList">
                                        <div className="guestContainer">
                                            <div className="guestDetails">
                                                <h6>Lougie Caday</h6>
                                                <p>lcaday.k123456789@umak.edu.ph</p>    
                                                <div className="buttons">
                                                <button>Present</button>
                                                </div>
                                            </div>
                                            <div className="smallhr">
                                                <hr />
                                            </div>
                                            <div className="guestDetails">
                                                <h6>Meinard Santos</h6>
                                                <p>msantos.k123456789@umak.edu.ph</p>
                                                <div className="buttons">
                                                <button>Present</button>
                                                </div>
                                            </div>
                                            <div className="smallhr">
                                                <hr />
                                            </div>
                                            <div className="guestDetails">
                                                <h6>Jayson Huub Partido</h6>
                                                <p>jpartido.k123456789@umak.edu.ph</p>   
                                                <div className="buttons">
                                                <button>Present</button>
                                                </div> 
                                            </div>
                                            <div className="smallhr">
                                                <hr />
                                            </div>
                                            <div className="guestDetails">
                                                <h6>Eric Lor</h6>
                                                <p>elor.k123456789@umak.edu.ph</p>
                                                <div className="buttons">
                                                <button>Present</button>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr />
                            <div className="organizerHeader">Event Attendance</div>
                            <div className="organizerDescription">
                                Efficiently track attendee check-ins and monitor participation in real-time during events.
                            </div>
                            <div className="eventScanner">
                                <button>QR Scanner</button>
                            </div>

                            <hr />
                            <div className="organizerHeader">Toggle Registration</div>
                            <div className="organizerDescription">
                                Enable or disable event registration with a single click for flexible attendee management.
                            </div>
                        </>
                    )}


                    {activeButton === 'Share' && 
                    <>
                    <hr />
                        <div className="organizerHeader">Send Notifications</div>
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
                            <div className="organizerHeader">Share Event</div>
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
                        <div className="organizerHeader">Report Generation</div>
                        <div className="organizerDescription">Generate comprehensive event performance and participation reports effortlessly.</div>
                        <div className="generateReport"><button>Generate Report</button></div>
                    <hr />
                        <div className="organizerHeader">Post Evaluation</div>
                        <div className="organizerDescription">Design and distribute surveys or forms to gather feedback and assess event performance.</div>
                        <div className="postEvaluation">
                            <Link href="/PostEvaluation"><button>Create</button></Link>
                            <button>Edit</button>
                            <Link href="/EvaluationSummary"><button>View Summary</button></Link>
                        </div>
                    <hr />
                        <div className="organizerHeader">Cancel Event</div>
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
